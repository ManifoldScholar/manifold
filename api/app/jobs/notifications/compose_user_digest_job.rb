module Notifications
  class ComposeUserDigestJob < ApplicationJob

    def perform(user, frequency)
      Notifications::SendDigest.run user: user, frequency: frequency
    end

  end
end
