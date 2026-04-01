# frozen_string_literal: true

module Notifications
  class Unsubscribe < ActiveInteraction::Base
    string :token

    validates :token, presence: true

    def execute
      payload = UnsubscribeToken.verify(token)
      user_id = payload["user_id"] || payload[:user_id]
      user = User.find user_id
      user.unsubscribe_all
      user
    rescue ActiveSupport::MessageVerifier::InvalidSignature,
           ActiveRecord::RecordNotFound
      errors.add(:token, "is invalid")
      nil
    end
  end
end
