module CalculatesFingerprints
  extend ActiveSupport::Concern

  included do
    delegate :calculate_fingerprint_interaction, :calculate_fingerprint_interaction_key, to: :class
  end

  # @see FingerprintInteraction
  # @param [Digest::SHA512] digest
  # @param [Boolean] nested
  # @param [Boolean] raw
  # @return [String, Digest::SHA512]
  def calculate_fingerprint(digest: Digest::SHA512.new, nested: false, raw: false)
    inputs = { calculate_fingerprint_interaction_key => self, digest: digest, nested: nested, raw: raw }

    calculate_fingerprint_interaction.run! inputs
  end

  class_methods do
    # @return [Class]
    def calculate_fingerprint_interaction
      @calculate_fingerprint_interaction ||= ::Fingerprints.derive_fingerprint_interaction_for self
    end

    # @return [Symbol]
    def calculate_fingerprint_interaction_key
      @calculate_fingerprint_interaction_key ||= ::Fingerprints.derive_fingerprint_interaction_key_for self
    end
  end
end
