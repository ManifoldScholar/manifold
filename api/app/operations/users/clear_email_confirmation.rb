# frozen_string_literal: true

module Users
  class ClearEmailConfirmation
    include Dry::Monads[:result, :do]
    include ManifoldApi::Deps[
      prepare_email_confirmation: "users.prepare_email_confirmation",
    ]

    # @param [User] user
    # @return [Dry::Monads::Result]
    def call(user)
      yield prepare_email_confirmation.(user, force: true)

      user.__send__(:synchronize_established!)

      return Success()
    end
  end
end
