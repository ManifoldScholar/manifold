module ExternalAuth
  class Payload
    # @!attribute [r] outcome
    # @return [ExternalAuth::UpsertUser]
    attr_reader :outcome

    delegate :provider, :user, :valid?, to: :outcome

    def initialize(outcome)
      @outcome = outcome
    end

    def failed?
      !outcome.valid?
    end

    def as_json(_options = nil)
      {
        type: "oauth",
        provider: provider,
        failed: failed?
      }.tap do |hsh|
        if valid?
          hsh[:authToken] = build_auth_token
        else
          hsh[:errors] = build_errors
        end
      end
    end

    private

    def build_errors
      outcome.errors.full_messages unless valid?
    end

    def build_auth_token
      AuthToken.encode(user_id: user.id) if valid?
    end
  end
end
