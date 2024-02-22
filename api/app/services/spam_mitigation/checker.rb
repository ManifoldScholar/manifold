# frozen_string_literal: true

module SpamMitigation
  # Check the spamminess of a given piece of content.
  #
  # Currently only supports Akismet, but this has been designed
  # to support multiple providers.
  #
  # @see SpamMitigation::Check
  class Checker
    include SpamMitigation::Integrations
    include Dry::Monads[:result, :do]
    include Dry::Initializer[undefined: false].define -> do
      param :content, Types::String

      option :user, Types.Instance(User).optional, default: proc { RequestStore[:current_user] }

      option :type, Types::String.optional, default: proc { "comment" }
    end

    delegate :trusted?, to: :user, allow_nil: true, prefix: true

    # @return [Dry::Monads::Success(Boolean)]
    def call
      # Bypass detection entirely for users who have privileged access,
      return Failure[:user_trusted] if user_trusted?

      return Failure[:spam_detection_disabled] if Settings.current.general.disable_spam_detection?

      checks = [check_with_akismet]

      is_spam = checks.any? do |result|
        Dry::Matcher::ResultMatcher.(result) do |m|
          m.success do |response|
            response == SPAM
          end

          m.failure do
            false
          end
        end
      end

      Success is_spam
    end

    private

    # @return [Dry::Monads::Result]
    def check_with_akismet
      api = SpamMitigation::Akismet::API.new

      api.comment_check(content, comment_type: type, user: user)
    end
  end
end
