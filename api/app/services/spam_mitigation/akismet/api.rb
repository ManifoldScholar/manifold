# frozen_string_literal: true

module SpamMitigation
  module Akismet
    class API
      include Dry::Monads[:result, :do]

      include Dry::Initializer[undefined: false].define -> do
        option :config, SpamMitigation::Akismet::Config, default: proc { SpamMitigation::Akismet::Config.new }
      end

      delegate :enabled?, to: :config

      # @return [Dry::Monads::Success(:spam)]
      # @return [Dry::Monads::Success(:not_spam)]
      # @return [Dry::Monads::Failure]
      def comment_check(...)
        SpamMitigation::Akismet::Endpoints::CommentCheck.new(...).call
      end

      # @return [Dry::Monads::Success(void)]
      # @return [Dry::Monads::Failure]
      def submit_spam(...)
        SpamMitigation::Akismet::Endpoints::SubmitSpam.new(...).call
      end
    end
  end
end
