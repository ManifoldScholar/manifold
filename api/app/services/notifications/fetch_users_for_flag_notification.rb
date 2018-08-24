module Notifications
  class FetchUsersForFlagNotification < ActiveInteraction::Base

    def execute
      User.with_notification_for_frequency(
        NotificationKind[:flagged_resources],
        NotificationFrequency[:always]
      )
    end

  end
end
