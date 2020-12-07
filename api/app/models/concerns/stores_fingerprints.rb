# A concern that builds on {CalculatesFingerprints} that
# augments a model to automatically calculate and store its
# fingerprint upon validation.
module StoresFingerprints
  extend ActiveSupport::Concern

  include CalculatesFingerprints

  included do
    raise TypeError, "Must be included into an ApplicationRecord subclass" unless ApplicationRecord::INHERITS[self]

    before_validation :calculate_and_store_fingerprint!
  end

  # @api private
  # @see CalculatesFingerprints#calculate_fingerprint
  # @return [void]
  def calculate_and_store_fingerprint!
    self.fingerprint = calculate_fingerprint
  end

  # @param [#hexdigest, String] digest
  def matches_fingerprint?(digest)
    fingerprint == Types::SHA512_FINGERPRINT[digest]
  end

  # @!api private
  # @param [#hexdigest, String] digest
  # @see FingerprintInteraction#maybe_update_fingerprint!
  # @return [void]
  def maybe_update_fingerprint!(digest)
    return unless persisted?

    received_fingerprint = Types::SHA512_FINGERPRINT[digest]

    update_column :fingerprint, received_fingerprint unless matches_fingerprint?(digest)
  end

  # Recalculate the fingerprint on-demand.
  #
  # @return [void]
  def recalculate_fingerprint!
    calculate_and_store_fingerprint!

    update_column :fingerprint, fingerprint if fingerprint_changed?
  end
end
