# frozen_string_literal: true

module Lti
  module DeepLinking
    # Orchestrates a deep linking submission: load the {Context} by token,
    # authorize the requesting user, validate the selection, provision the course
    # reading group, sign the Deep Linking Response, and consume the context.
    # Each step delegates to a focused collaborator; this object only sequences
    # them and maps results to the JSON:API response the controller renders.
    #
    # Order matters: the context is consumed only after a fully successful
    # submission, so a failed or wrong-instructor request never burns the token.
    class HandleSubmission
      include Dry::Monads[:result]
      include ContextErrors

      # @param params [Hash, ActionController::Parameters] keys: :context_token, :selection
      # @param user [User] current_user from authenticated request
      def initialize(params, user)
        @params = params.respond_to?(:to_unsafe_h) ? params.to_unsafe_h.with_indifferent_access : params.with_indifferent_access
        @user   = user
      end

      # @return [Dry::Monads::Result] Success carries deep_link_return_url + jwt;
      #   Failure carries :status and a JSON:API-shaped :errors array.
      def call
        return expired_failure if context.nil?
        return forbidden_failure unless context.owned_by?(user)

        ValidateSelection.new(context, params[:selection]).call.bind { |references| complete(references) }
      rescue StandardError => e
        internal_error(e)
      end

      private

      attr_reader :params, :user

      def context
        @context ||= Context.find(params[:context_token])
      end

      def complete(references)
        ProvisionReadingGroup.new(course_context: course_context, user: user, references: references).call
        jwt = BuildResponseToken.new(context, content_items(references)).call
        context.consume!
        Success(deep_link_return_url: context.deep_link_return_url, jwt: jwt)
      end

      def course_context
        @course_context ||= LtiCourseContext.find(context.lti_course_context_id)
      end

      def content_items(references)
        Array(params[:selection]).zip(references).map do |item, reference|
          { "url" => reference.launch_url, "title" => item["title"] }
        end
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
