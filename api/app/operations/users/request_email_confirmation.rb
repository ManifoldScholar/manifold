# frozen_string_literal: true

module Users
  class RequestEmailConfirmation
    include Dry::Monads[:result, :do]
    include ManifoldApi::Deps[
      prepare_email_confirmation: "users.prepare_email_confirmation",
    ]

    # @param [User] user
    # @return [Dry::Monads::Success]
    def call(user)
      yield prepare_email_confirmation.(user)

      return Success() if user.email_confirmed?

      user.touch :email_confirmation_sent_at

      AccountMailer.email_confirmation(user).deliver_later

      Success()
    end
  end
end
