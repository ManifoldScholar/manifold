# frozen_string_literal: true

module SoftDeletions
  # Exception raised when attempting to purge an unpurgeable record.
  # @see SoftDeletions::Purger
  class Unpurgeable < StandardError; end
end
