# frozen_string_literal: true

module SoftDeletions
  # @see SoftDeletable
  # @see SoftDeletions::PurgeJob
  # @see SoftDeletions::Purger
  class Purge
    def call(...)
      SoftDeletions::Purger.new(...).call
    end
  end
end
