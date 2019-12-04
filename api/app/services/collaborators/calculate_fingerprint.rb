module Collaborators
  # Calculate the fingerprint for a {Collaborator}
  class CalculateFingerprint < ActiveInteraction::Base
    include Concerns::FingerprintInteraction

    record :collaborator

    def add_details!
      update_digest_with! collaborator, :id, :maker_id, :role, :maker_name
    end
  end
end
