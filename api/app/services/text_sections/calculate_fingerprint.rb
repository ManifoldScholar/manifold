module TextSections
  # Calculate the fingerprint for a {TextSection}
  class CalculateFingerprint < ActiveInteraction::Base
    include FingerprintInteraction

    fingerprint_target! :text_section

    def add_details!
      update_digest_with! text_section, :id, :source_identifier, :body_json, :citations
    end
  end
end
