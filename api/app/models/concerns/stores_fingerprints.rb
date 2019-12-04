module Concerns
  # A concern that builds on {Concerns::CalculatesFingerprints} that
  # augments a model to automatically calculate and store its
  # fingerprint upon validation.
  module StoresFingerprints
    extend ActiveSupport::Concern

    include Concerns::CalculatesFingerprints

    included do
      raise TypeError, "Must be included into an ApplicationRecord subclass" unless ApplicationRecord::INHERITS[self]

      before_validation :calculate_and_store_fingerprint!
    end

    # @api private
    # @see Concerns::CalculatesFingerprints#calculate_fingerprint
    # @return [void]
    def calculate_and_store_fingerprint!
      self.fingerprint = calculate_fingerprint
    end

    # Recalculate the fingerprint on-demand.
    #
    # @return [void]
    def recalculate_fingerprint!
      calculate_and_store_fingerprint!

      save! if fingerprint_changed?
    end
  end
end
