module Notifications
  class FetchUsersForFlagNotification < ActiveInteraction::Base
    def execute
      User.with_notification_for_frequency(:flagged_resources, :always)
    end
  end
end
