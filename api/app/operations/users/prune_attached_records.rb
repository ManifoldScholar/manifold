# frozen_string_literal: true

module Users
  # @see Users::AttachedRecordsPruner
  class PruneAttachedRecords
    def call(...)
      Users::AttachedRecordsPruner.new(...).call
    end
  end
end
