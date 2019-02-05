module Notifications
  class SendFlagNotificationJob < ApplicationJob

    # @param [String] user_id
    # @param [String] flag_id
    def perform(user_id, flag_id)
      user = User.find(user_id)
      resource = Flag.find(flag_id)&.flaggable
      raise ActiveRecord::RecordNotFound unless resource.present?

      NotificationMailer.flag_notification(user, resource).deliver
    rescue ActiveRecord::RecordNotFound
      Rails.logger.error("ActiveRecord::RecordNotFound error in SendFlagNotificationJob")
      Rails.logger.error(
        "  Failed to notify #<User:#{user_id}> of flag #<Flag:#{flag_id}>"
      )
    end

  end
end
