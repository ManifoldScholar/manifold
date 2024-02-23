# frozen_string_literal: true

module Users
  class PrepareEmailConfirmation
    include Dry::Monads[:result, :do]
    include ManifoldApi::Deps[
      email_confirmation_verifier: :email_confirmation_verifier,
      verify_email_token: "users.verify_email_token",
    ]

    # @param [User] user
    # @param [Boolean] force
    # @return [Dry::Monads::Result]
    def call(user, force: false)
      return Success() unless force || needs_new_token?(user)

      new_token = email_confirmation_verifier.generate user.email, purpose: :email

      user.update_columns(
        email_confirmation_token: new_token,
        email_confirmed_at: nil
      )

      Success()
    end

    private

    # @param [User] user
    def needs_new_token?(user)
      user.email_confirmation_token.blank? || verify_email_token.(user, user.email_confirmation_token).failure?
    end
  end
end
