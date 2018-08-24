module Notifications
  class SendCommentNotificationJob < ApplicationJob

    # @param [String] user_id
    # @param [String] comment_id
    def perform(user_id, comment_id)
      user = User.find(user_id)
      comment = Comment.find(comment_id)
      NotificationMailer.comment_notification(user, comment).deliver
    # rubocop:disable Metrics/LineLength
    rescue ActiveRecord::RecordNotFound
      Rails.logger.error("ActiveRecord::RecordNotFound error in SendReplyNotificationJob")
      Rails.logger.error(
        "  Failed to send new comment notification for #<Comment:#{comment_id} to #<User:#{user_id}>"
      )
      # rubocop:enable Metrics/LineLength
    end

  end
end
