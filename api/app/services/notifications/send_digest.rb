module Notifications
  class SendDigest < ActiveInteraction::Base
    object :user
    string :frequency
    validates_inclusion_of :frequency, in: NotificationFrequency

    def execute
      events = compose Notifications::ComposeDigestEvents, inputs
      return if events.values.reject(&:blank?).none? # No news is... not news

      NotificationMailer
        .digest(user, NotificationFrequency.fetch(frequency), events)
        .deliver
    end

  end
end
