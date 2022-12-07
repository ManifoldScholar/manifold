# frozen_string_literal: true

module Users
  class ConfirmEmail
    include Dry::Monads[:result, :do]
    include ManifoldApi::Deps[
      mark_email_confirmed: "users.mark_email_confirmed",
      verify_email_token: "users.verify_email_token",
    ]

    # @param [User] user
    # @param [String] token
    # @return [Dry::Monads::Result]
    def call(user, token)
      yield verify_email_token.(user, token)

      yield mark_email_confirmed.(user, force: true)

      Success()
    end
  end
end
