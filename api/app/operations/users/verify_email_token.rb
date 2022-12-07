# frozen_string_literal: true

module Users
  class VerifyEmailToken
    include Dry::Monads[:result, :do]
    include ManifoldApi::Deps[
      email_confirmation_verifier: :email_confirmation_verifier,
    ]

    # @param [User] user
    # @param [String] token
    # @return [Dry::Monads::Result]
    def call(user, token)
      encoded_email = email_confirmation_verifier.verify token, purpose: :email
    rescue ActiveSupport::MessageVerifier::InvalidSignature
      Failure[:invalid_token]
    else
      if user.email == encoded_email
        Success()
      else
        Failure[:email_mismatch]
      end
    end
  end
end
