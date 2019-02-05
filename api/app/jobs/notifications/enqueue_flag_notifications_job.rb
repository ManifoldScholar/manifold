module Notifications
  class EnqueueFlagNotificationsJob < ApplicationJob

    # @param [String] flag_id
    def perform(flag_id)
      ensure_resource(flag_id)
      outcome = Notifications::FetchUsersForFlagNotification.run
      raise "Unable to fetch users for flag notification" unless outcome.valid?

      outcome.result.pluck(:id).each do |user_id|
        Notifications::SendFlagNotificationJob.perform_later(user_id, flag_id)
      end
    rescue ActiveRecord::RecordNotFound
      Rails.logger.error(
        "ActiveRecord::RecordNotFound error in EnqueueFlagNotificationsJob"
      )
      Rails.logger.error(
        "  Failed to enqueue notifications for #<Flag:#{flag_id}>"
      )
    end

    private

    def ensure_resource(flag_id)
      resource = Flag.find(flag_id)&.flaggable
      raise ActiveRecord::RecordNotFound unless resource.present?
    end

  end
end
