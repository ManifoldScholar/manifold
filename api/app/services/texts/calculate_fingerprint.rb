module Texts
  # Calculate a fingerprint for a {Text}.
  class CalculateFingerprint < ActiveInteraction::Base
    include FingerprintInteraction

    fingerprint_target! :text

    # @return [String]
    def add_details!
      update_digest_with! text, :id, :description, :landmarks, :publication_date, :toc

      calculate_fingerprints_for! text.text_sections
      calculate_fingerprints_for! text.titles
      calculate_fingerprints_for! text.collaborators.includes(:maker)
    end
  end
end
