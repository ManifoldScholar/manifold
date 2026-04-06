# frozen_string_literal: true

module SoftDeletions
  # Current attributes for tracking the status of the soft-deletion process.
  #
  # @see SoftDeletionSupport
  class Current < ActiveSupport::CurrentAttributes
    attribute :active

    class << self
      alias active? active

      # @return [void]
      def active!
        set(active: true) do
          yield
        end
      end
    end
  end
end
