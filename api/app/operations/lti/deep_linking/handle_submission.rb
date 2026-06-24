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
    #   5. Sign the response, then consume the context (single-use).
    #
    # Order matters because (a) consuming the context before validation would
    # let a wrong-instructor request burn the instructor's session, and (b)
    # business-rule checks need the context's accept_types/accept_multiple.
    class HandleSubmission
      include Dry::Monads[:result]
      include ContextErrors

      RESOURCE_LINK_TYPE = "ltiResourceLink"
      REQUIRED_SELECTION_KEYS = %w[url].freeze

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

      def sign_and_consume
        jwt = BuildResponseToken.new(context, selection).call
        context.consume!
        Success(deep_link_return_url: context.deep_link_return_url, jwt: jwt)
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

        return "Selected resources must be hosted on this Manifold instance." unless selection.all? { |item| manifold_url?(item["url"]) }

        nil
      end

      # Guards against signing an off-domain URL into the tool's JWT, which the
      # platform would trust — a signed open-redirect vector. Mirrors the host
      # check in {Auth::OmniauthRedirect#target_path}.
      def manifold_url?(url)
        uri = URI.parse(url.to_s)
        uri.host.present? && uri.host == manifold_domain
      rescue URI::InvalidURIError
        false
      end

      def manifold_domain
        @manifold_domain ||= Rails.application.config.manifold.domain.to_s.gsub(/:\d+/, "")
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
