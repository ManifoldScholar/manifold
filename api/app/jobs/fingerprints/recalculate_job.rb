module Fingerprints
  # @see Fingerprints::Recalculate
  class RecalculateJob < ApplicationJob
    queue_as :default

    # @param [Concerns::StoresFingerprints] fingerprintable
    # @return [void]
    def perform(fingerprintable)
      Fingerprints::Recalculate.run! fingerprintable: fingerprintable
    end
  end
end
