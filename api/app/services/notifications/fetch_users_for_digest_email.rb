module Notifications
  class FetchUsersForDigestEmail < ActiveInteraction::Base
    string :frequency
    validates_inclusion_of :frequency, in: NotificationFrequency

    def execute
      frequency_instance = NotificationFrequency.fetch(frequency)
      User.with_digest_for_frequency(frequency_instance)
    end

  end
end
