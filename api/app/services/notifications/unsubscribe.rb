module Notifications
  class Unsubscribe < ActiveInteraction::Base
    string :token

    validates :token, presence: true

    def execute
      user_id = UnsubscribeToken.verify(token).dig(:user_id)
      user = User.find user_id
      user.unsubscribe_all
      user
    rescue ActiveSupport::MessageVerifier::InvalidSignature,
           ActiveRecord::RecordNotFound
      errors.add(:token, "is invalid")
    end
  end
end
