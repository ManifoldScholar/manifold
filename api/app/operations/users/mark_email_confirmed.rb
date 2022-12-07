# frozen_string_literal: true

module Users
  class MarkEmailConfirmed
    include Dry::Monads[:result, :do]
    include ManifoldApi::Deps[
      prepare_email_confirmation: "users.prepare_email_confirmation",
    ]

    # @param [User] user
    # @param [Boolean] force
    # @return [Dry::Monads::Result]
    def call(user, force: false)
      yield prepare_email_confirmation.(user)

      user.touch :email_confirmed_at if !user.email_confirmed? || force

      Entitlements::CreateFromUserJob.set(wait: 10.seconds).perform_later user

      Success()
    end
  end
end
