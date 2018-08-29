module Notifications
  class SendDigestJob < ApplicationJob

    # @param [String] user_id
    # @param [String] frequency
    def perform(user_id, frequency)
      user = User.find(user_id)
      Notifications::SendDigest.run user: user, frequency: frequency
    rescue ActiveRecord::RecordNotFound
      Rails.logger.error("ActiveRecord::RecordNotFound error in SendDigestJob")
      Rails.logger.error(
        "  Failed to send digest to #<User:#{user_id}>"
      )
    end

  end
end
