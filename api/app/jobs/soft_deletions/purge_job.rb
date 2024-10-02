# frozen_string_literal: true

module SoftDeletions
  # @see SoftDeletable#async_destroy
  class PurgeJob < ApplicationJob
    queue_as :deletions

    discard_on ActiveJob::DeserializationError, ActiveRecord::RecordNotFound, ActiveRecord::RecordNotDestroyed

    # @param [SoftDeletable] record
    # @return [void]
    def perform(record)
      record.destroy! if record.marked_for_purge?
    end
  end
end
