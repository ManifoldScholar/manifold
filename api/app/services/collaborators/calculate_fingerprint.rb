module Collaborators
  # Calculate the fingerprint for a {Collaborator}
  class CalculateFingerprint < ActiveInteraction::Base
    include FingerprintInteraction

    fingerprint_target! :collaborator

    def add_details!
      update_digest_with! collaborator, :id, :maker_id, :role, :maker_name
    end
  end
end
