module Notifications
  class EnqueueUserDigestsJob < ApplicationJob

    def perform(frequency)
      return unless frequency.present?
      User.with_digest_for_frequency(frequency).each do |user|
        Notifications::ComposeUserDigestJob.perform_later user, frequency
      end
    end

  end
end
