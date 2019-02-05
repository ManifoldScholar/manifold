module Notifications
  class EnqueueDigestsJob < ApplicationJob

    # @param [String] frequency
    def perform(frequency)
      return unless frequency.present?

      outcome = Notifications::FetchUsersForDigestEmail.run(frequency: frequency)
      raise "Unable to fetch users for digest email" unless outcome.valid?

      outcome.result.pluck(:id).each do |user_id|
        Notifications::SendDigestJob.perform_later user_id, frequency
      end
    end
  end
end
