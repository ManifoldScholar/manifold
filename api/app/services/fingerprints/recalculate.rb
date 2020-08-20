module Fingerprints
  # @see StoresFingerprints
  # @see Fingerprints::RecalculateJob
  class Recalculate < ActiveInteraction::Base
    isolatable!

    transactional!

    object :fingerprintable, class: "StoresFingerprints"

    # @return [void]
    def execute
      fingerprintable.recalculate_fingerprint!
    end
  end
end
