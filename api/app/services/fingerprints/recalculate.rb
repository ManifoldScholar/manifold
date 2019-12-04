module Fingerprints
  # @see Concerns::StoresFingerprints
  # @see Fingerprints::RecalculateJob
  class Recalculate < ActiveInteraction::Base
    isolatable!

    transactional!

    object :fingerprintable, class: "Concerns::StoresFingerprints"

    # @return [void]
    def execute
      fingerprintable.recalculate_fingerprint!
    end
  end
end
