module Notifications
  class SendReplyNotificationJob < ApplicationJob

    # @param [String] user_id
    # @param [String] comment_id
    def perform(user_id, comment_id)
      user = User.find(user_id)
      comment = Comment.find(comment_id)
      NotificationMailer.reply_notification(user, comment).deliver
    rescue ActiveRecord::RecordNotFound
      Rails.logger.error("ActiveRecord::RecordNotFound error in SendReplyNotificationJob")
      Rails.logger.error(
        "  Failed to send reply notification for #<Comment:#{comment_id} to #<User:#{user_id}>"
      )
    end

  end
end
