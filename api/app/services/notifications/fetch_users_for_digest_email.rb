module Notifications
  class FetchUsersForDigestEmail < ActiveInteraction::Base
    record :frequency, class: "NotificationFrequency", finder: :[]

    # @return [ActiveRecord::Relation<User>]
    def execute
      User.with_digest_for_frequency frequency
    end
  end
end
