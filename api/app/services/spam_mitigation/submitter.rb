# frozen_string_literal: true

module SpamMitigation
  # Submit content that _should_ be considered spam to supported providers.
  #
  # Currently only supports Akismet.
  #
  # @see SpamMitigation::Submit
  class Submitter
    extend ActiveModel::Callbacks

    include SpamMitigation::Integrations
    include Dry::Monads[:result, :do]
    include Dry::Initializer[undefined: false].define -> do
      param :content, Types::String

      option :user, Types.Instance(User).optional, default: proc { RequestStore[:current_user] }

      option :type, Types::String.optional, default: proc { "comment" }
    end

    STRATEGIES = %i[akismet].freeze

    # @return [Dry::Monads::Success({ Symbol => Dry::Monads::Result })]
    def call
      results = STRATEGIES.index_with do |strategy|
        __send__(:"submit_with_#{strategy}")
      end

      Success results
    end

    private

    # @return [Dry::Monads::Result]
    def submit_with_akismet
      api = SpamMitigation::Akismet::API.new

      response = yield api.submit_spam(content, comment_type: type, user: user)

      Success response.body
    end
  end
end
