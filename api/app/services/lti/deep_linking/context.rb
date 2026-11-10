# frozen_string_literal: true

module Lti
  module DeepLinking
    # The deep linking context — the bundle of deep linking settings and contextual claims a launch
    # produces. Build one from a launch with {.from_launch} and {#persist!} it to mint an opaque token;
    # load one back with {.find}; consume it with {#consume!}. The launch auth hash is assumed already
    # validated by OmniAuth::Strategies::Lti — this object performs no JWT verification.
    class Context < CacheableStruct
      cache_ttl 1.hour
      cache_key_prefix "lti/dl"

      class InvalidRequestError < Error; end

      attribute :user_id, Types::String
      attribute :client_id, Types::String
      attribute :iss, Types::String
      attribute :deployment_id, Types::String
      attribute :deep_link_return_url, Types::String
      attribute :lti_course_context_id, Types::String
      attribute? :data, Types::String.optional
      attribute :accept_multiple, Types::Bool.optional
      attribute :accept_types, Types::Array.of(Types::String).default([].freeze)

      # Build a context from an LTI launch. Validates before touching the database so a malformed request
      # neither provisions a course context nor writes to cache.
      # @param omniauth_hash [OmniAuth::AuthHash, Hash] request.env["omniauth.auth"]
      # @param user [User] the authenticated instructor
      def self.from_launch(omniauth_hash, user)
        launch = Lti::Launch.new(omniauth_hash)
        settings = launch.deep_linking_settings
        raise InvalidRequestError, "Missing deep_link_return_url" if settings["deep_link_return_url"].blank?

        new(
          data: settings["data"],
          deep_link_return_url: settings["deep_link_return_url"],
          accept_types: Array(settings["accept_types"]),
          accept_multiple: settings["accept_multiple"],
          deployment_id: launch.deployment_id,
          iss: launch.issuer,
          client_id: launch.client_id,
          lti_course_context_id: course_context_for(launch).id,
          user_id: user.id
        )
      end

      def self.course_context_for(launch)
        LtiCourseContext.find_or_create_by!(lti_deployment: launch.deployment, context_id: launch.context_id) do |ctx|
          ctx.context_title = launch.context_title
          ctx.context_label = launch.context_label
          ctx.context_type  = launch.context_type
        end
      rescue ActiveRecord::RecordNotUnique
        LtiCourseContext.find_by!(lti_deployment: launch.deployment, context_id: launch.context_id)
      end
      private_class_method :course_context_for

      def owned_by?(user)
        user_id == user.id
      end
    end
  end
end
