# frozen_string_literal: true

module Entitlements
  # Given a {User}, check for any pending import rows
  # that match the user's email address and enqueue a
  # {Entitlements::CreateForRowJob} for it.
  class CreateFromUserJob < ApplicationJob
    queue_as :default

    # @param [User] user
    # @return [void]
    def perform(user)
      PendingEntitlement.pending_for_email(user.email).find_each do |pe|
        Entitlements::CreatePendingJob.perform_later pe
      end
    end
  end
end
