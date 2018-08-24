module Notifications
  class NotifyFlaggedResourceJob < ApplicationJob

    def perform(resource)
      users = User.with_notification_for_frequency(NotificationKind[:flagged_resources],
                                                   NotificationFrequency[:always])
      users.each do |user|
        NotificationMailer.flag_notification(user, resource).deliver
      end
    end
  end
end
