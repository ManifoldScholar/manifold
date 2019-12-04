module TextTitles
  # Calculate the fingerprint for a {TextTitle}
  class CalculateFingerprint < ActiveInteraction::Base
    include Concerns::FingerprintInteraction

    record :text_title

    def add_details!
      update_digest_with! text_title, :id, :value
    end
  end
end
