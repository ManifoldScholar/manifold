module Notifications
  class FetchUsersForFlagNotification < ActiveInteraction::Base
    def execute
      User.by_cached_role(:admin).with_notification_for_frequency(:flagged_resources, :always)
    end
  end
end
