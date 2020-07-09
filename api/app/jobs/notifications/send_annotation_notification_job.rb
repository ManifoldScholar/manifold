module Notifications
  class SendAnnotationNotificationJob < ApplicationJob

    # @param [String] user_id
    # @param [String] annotation_id
    def perform(user_id, annotation_id)
      user = User.find(user_id)
      annotation = Annotation.find(annotation_id)
      NotificationMailer.annotation_notification(user, annotation).deliver
    rescue ActiveRecord::RecordNotFound
      Rails.logger.error("ActiveRecord::RecordNotFound error in SendAnnotationNotificationJob")
      Rails.logger.error(
        "  Failed to send new annotation notification for #<Annotation:#{annotation_id} to #<User:#{user_id}>"
      )
    end

  end
end
