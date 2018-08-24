module Notifications
  class SendDigest < ActiveInteraction::Base
    object :user
    object :frequency, class: "NotificationFrequency"

    def execute
      events = compose Notifications::ComposeDigestEvents, inputs
      return if events.values.reject(&:blank?).none? # No news is... not news

      NotificationMailer.digest(user, frequency, events).deliver
    end

  end
end
