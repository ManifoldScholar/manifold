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
      EntitlementImportRow.pending_for_email(user.email).find_each do |row|
        Entitlements::CreateForRowJob.perform_later row
      end
    end
  end
end
