# frozen_string_literal: true

module Makers
  # Calculate the fingerprint for a {Maker}
  class CalculateFingerprint < ActiveInteraction::Base
    include FingerprintInteraction

    fingerprint_target! :maker

    def add_details!
      update_digest_with! maker, *Maker::PACKAGING_ATTRIBUTES
    end
  end
end
