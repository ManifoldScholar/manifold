# frozen_string_literal: true

module Lti
  module DeepLinking
    # Encapsulates an LTI Deep Linking context — the bundle of deep linking
    # settings and contextual claims a launch produces — and is the sole
    # interface for reading and writing that context in Rails.cache.
    #
    # Build one from a launch with {.from_launch} and {#persist!} it to mint an
    # opaque token; load one back with {.find}; consume it (single use) with
    # {#consume!}. The launch auth hash is assumed already validated by
    # OmniAuth::Strategies::Lti — this object performs no JWT verification.
    class Context
      CACHE_TTL = 1.hour
      CACHE_KEY_PREFIX = "lti/dl"

      PAYLOAD_READERS = %w[
        user_id client_id iss deployment_id accept_multiple
        deep_link_return_url data lti_course_context_id
      ].freeze

      class Error < StandardError; end
      class InvalidRequestError < Error; end
      class IdempotencyError < Error; end

      # Build a context from an LTI launch (write path).
      # @param omniauth_hash [OmniAuth::AuthHash, Hash] request.env["omniauth.auth"]
      # @param user [User] the authenticated instructor
      def self.from_launch(omniauth_hash, user)
        new(launch: Lti::Launch.new(omniauth_hash), user: user)
      end

      # Load a previously persisted context (read path).
      # @param token [String] the opaque token returned by {#persist!}
      # @return [Context, nil] nil when the token is unknown or expired
      def self.find(token)
        payload = Rails.cache.read(cache_key(token))
        return if payload.blank?

        new(token: token, payload: payload)
      end

      # @return [String]
      def self.cache_key(token)
        "#{CACHE_KEY_PREFIX}/#{token}"
      end

      def initialize(launch: nil, user: nil, token: nil, payload: nil)
        @launch = launch
        @user = user
        @token = token
        @payload = payload
      end
      private_class_method :new

      # Validate the launch, build the payload, write it to cache, and return
      # the minted token. Raises an {Error} subclass on validation failure, in
      # which case nothing is written.
      # @return [String] 64-character hex token
      def persist!
        raise IdempotencyError, "Context can only be persisted once" if token

        validate!
        @payload = build_payload
        @token = SecureRandom.hex(32)
        Rails.cache.write(self.class.cache_key(token), payload, expires_in: CACHE_TTL)
        token
      end

      # Delete the cached context (single-use consumption).
      # @return [void]
      def consume!
        Rails.cache.delete(self.class.cache_key(token))
      end

      attr_reader :token

      PAYLOAD_READERS.each do |field|
        define_method(field) { payload[field] }
      end

      def accept_types
        Array(payload["accept_types"])
      end

      # @param user [User]
      # @return [Boolean]
      def owned_by?(user)
        user_id == user.id
      end

      private

      attr_reader :launch, :user

      def payload
        @payload ||= {}
      end

      def validate!
        raise InvalidRequestError, "Missing deep_link_return_url" if dl_settings["deep_link_return_url"].blank?
      end

      def build_payload
        {
          "data" => dl_settings["data"],
          "deep_link_return_url" => dl_settings["deep_link_return_url"],
          "accept_types" => dl_settings["accept_types"],
          "accept_multiple" => dl_settings["accept_multiple"],
          "deployment_id" => launch.deployment_id,
          "iss" => launch.issuer,
          "client_id" => launch.client_id,
          "lti_course_context_id" => course_context.id,
          "user_id" => user.id
        }
      end

      def dl_settings
        launch.deep_linking_settings
      end

      def course_context
        @course_context ||= LtiCourseContext.find_or_create_by!(
          lti_deployment: launch.deployment,
          context_id: launch.context_id
        ) do |ctx|
          ctx.context_title = launch.context_title
          ctx.context_label = launch.context_label
          ctx.context_type  = launch.context_type
        end
      rescue ActiveRecord::RecordNotUnique
        @course_context = LtiCourseContext.find_by!(lti_deployment: launch.deployment, context_id: launch.context_id)
      end
    end
  end
end
