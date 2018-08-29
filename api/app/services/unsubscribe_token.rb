module UnsubscribeToken
  class << self

    delegate :verify, to: :verifier

    def generate(user)
      verifier.generate user_id: user.id
    end

    private

    def verifier
      Rails.application.message_verifier("unsubscribe_token")
    end
  end
end
