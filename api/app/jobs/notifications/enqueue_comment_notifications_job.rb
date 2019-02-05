module Notifications
  class EnqueueCommentNotificationsJob < ApplicationJob

    # @param [String] comment_id
    def perform(comment_id)
      comment = Comment.find(comment_id)
      enqueue_reply_notifications comment
      enqueue_comment_notifications comment
    rescue ActiveRecord::RecordNotFound
      Rails.logger.error(
        "ActiveRecord::RecordNotFound error in EnqueueCommentNotificationsJob"
      )
      Rails.logger.error(
        "  Failed to enqueue notifications for #<Comment:#{comment_id}>"
      )
    end

    def enqueue_reply_notifications(comment)
      outcome = Notifications::FetchUsersForReplyNotification.run(comment: comment)
      return unless outcome.valid?

      outcome.result.each do |user|
        Notifications::SendReplyNotificationJob.perform_later user.id, comment.id
      end
    end

    def enqueue_comment_notifications(comment)
      outcome = Notifications::FetchUsersForCommentNotification.run(comment: comment)
      return unless outcome.valid?

      outcome.result.each do |user|
        Notifications::SendCommentNotificationJob.perform_later user.id, comment.id
      end
    end

  end
end
