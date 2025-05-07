# frozen_string_literal: true

# Global namespace & derivation methods for fingerprinting
# models.
#
# @see CalculatesFingerprint
# @see FingerprintInteraction
module Fingerprints
  # Error raised when a fingerprint interaction {#derive_fingerprint_interaction_for cannot be derived}.
  class UnknownFingerprintInteraction < StandardError; end

  module_function

  # @param [ApplicationRecord, #model_name] model
  # @return [Class]
  def derive_fingerprint_interaction_for(model)
    klass_name = "#{model.model_name.collection.camelize}::CalculateFingerprint"

    klass_name.constantize
  rescue NameError
    raise UnknownFingerprintInteraction, "Could not derive fingerprinting interaction for #{model.model_name}, expected #{klass_name}"
  end

  # @param [ApplicationRecord, #model_name] model
  # @return [Symbol]
  def derive_fingerprint_interaction_key_for(model)
    model.model_name.i18n_key
  end
end
