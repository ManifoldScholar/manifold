module Notifications
  class EnqueueAnnotationNotificationsJob < ApplicationJob

    # @param [String] annotation_id
    def perform(annotation_id)
      annotation = Annotation.find(annotation_id)
      return if annotation.private?

      outcome = Notifications::FetchUsersForAnnotationNotification.run(annotation: annotation)
      return unless outcome.valid?

      outcome.result.each do |user|
        Notifications::SendAnnotationNotificationJob.perform_later user.id, annotation.id
      end
    rescue ActiveRecord::RecordNotFound
      Rails.logger.error(
        "ActiveRecord::RecordNotFound error in EnqueueAnnotationNotificationsJob"
      )
      Rails.logger.error(
        "  Failed to enqueue notifications for #<Annotation:#{annotation_id}>"
      )
    end

  end
end
