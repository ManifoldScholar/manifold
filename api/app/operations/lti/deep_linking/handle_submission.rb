# frozen_string_literal: true

module Lti
  module DeepLinking
    # Loads a deep linking {Context} by token, validates the requesting user and
    # the submitted selection, signs the Deep Linking Response, consumes the
    # context, and returns a {Dry::Monads::Result} the controller renders.
    #
    # Validation order is load-bearing:
    #   1. Load context by token.     Failure -> :unauthorized (code: "expired")
    #   2. Validate user identity.    Failure -> :forbidden    (code: "unauthorized")
    #   3. Validate selection shape.  Failure -> :unprocessable_entity (per-field)
    #   4. Validate business rules.   Failure -> :bad_request  (single message)
    #   5. Provision the course reading group (create-or-reuse, attach resources).
    #   6. Sign the response, then consume the context (single-use).
    #
    # Order matters because (a) consuming the context before validation would
    # let a wrong-instructor request burn the instructor's session, and (b)
    # business-rule checks need the context's accept_types/accept_multiple.
    class HandleSubmission
      include Dry::Monads[:result]
      include ContextErrors

      RESOURCE_LINK_TYPE = "ltiResourceLink"
      REQUIRED_SELECTION_KEYS = %w[type id].freeze

      # @param params [Hash, ActionController::Parameters] keys: :context_token, :selection (Array<Hash>)
      # @param user [User] current_user from authenticated request
      def initialize(params, user)
        @params = params.respond_to?(:to_unsafe_h) ? params.to_unsafe_h.with_indifferent_access : params.with_indifferent_access
        @user   = user
      end

      # @return [Dry::Monads::Result] Success on a consumed context; Failure
      #   carries :status and a JSON:API-shaped :errors array.
      def call
        return expired_failure if context.nil?
        return forbidden_failure unless context.owned_by?(user)

        shape_errors = validate_shape
        return Failure(status: 422, errors: shape_errors) if shape_errors.any?

        business_error = validate_business_rules
        return business_failure(business_error) if business_error

        provision_reading_group!
        sign_and_consume
      rescue StandardError => e
        internal_error(e)
      end

      private

      attr_reader :params, :user

      def context
        @context ||= Context.find(params[:context_token])
      end

      def selection
        @selection ||= Array(params[:selection])
      end

      def references
        @references ||= selection.map { |item| Lti::ResourceReference.new(type: item["type"], id: item["id"]) }
      end

      # Create-or-reuse the single reading group for this course and attach the
      # selected resources. Setting `creator` enrolls the instructor as a
      # moderator via ReadingGroup's after_save hook; collect_model! is idempotent.
      def provision_reading_group!
        ReadingGroup.transaction do
          references.each { |reference| reading_group.collect_model!(reference.entity) }
        end
      end

      def reading_group
        @reading_group ||= course_context.reading_group || create_reading_group!
      end

      def create_reading_group!
        ReadingGroup.create!(name: reading_group_name, privacy: "private", creator: user).tap do |group|
          course_context.update!(reading_group: group)
        end
      end

      def reading_group_name
        course_context.context_title.presence || "Course #{course_context.context_id}"
      end

      def course_context
        @course_context ||= LtiCourseContext.find(context.lti_course_context_id)
      end

      def sign_and_consume
        jwt = BuildResponseToken.new(context, content_items).call
        context.consume!
        Success(deep_link_return_url: context.deep_link_return_url, jwt: jwt)
      end

      def content_items
        selection.zip(references).map { |item, reference| { "url" => reference.launch_url, "title" => item["title"] } }
      end

      def validate_shape
        raw = params[:selection]
        return [field_error("/data/attributes/selection", "can't be blank")] if raw.blank?
        return [field_error("/data/attributes/selection", "must be an array")] unless raw.is_a?(Array)

        raw.each_with_index.flat_map { |item, idx| validate_selection_item(item, idx) }
      end

      def validate_selection_item(item, idx)
        return [field_error("/data/attributes/selection/#{idx}", "must be an object")] unless item.is_a?(Hash)

        REQUIRED_SELECTION_KEYS.filter_map do |key|
          field_error("/data/attributes/selection/#{idx}/#{key}", "can't be blank") if item[key].blank?
        end
      end

      def field_error(pointer, detail)
        { status: "422", source: { pointer: pointer }, detail: detail }
      end

      def validate_business_rules
        unless context.accept_types.include?(RESOURCE_LINK_TYPE)
          return "This deep linking session does not accept resource links."
        end

        if context.accept_multiple == false && selection.length > 1
          return "Only a single resource may be selected for this deep linking session."
        end

        return "Selected resources could not be found or are not linkable." unless references.all?(&:valid?)

        nil
      end

      def business_failure(message)
        Failure(
          status: :bad_request,
          errors: [{ status: "400", code: "invalid_selection", title: "Invalid Selection", detail: message }]
        )
      end

      def internal_error(error)
        Rails.logger.error("Lti::DeepLinking::HandleSubmission failed: #{error.class.name}: #{error.message}")
        Failure(
          status: :internal_server_error,
          errors: [{ status: "500", code: "internal_error", title: "Internal Error", detail: "An unexpected error occurred." }]
        )
      end
    end
  end
end
