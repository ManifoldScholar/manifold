# frozen_string_literal: true

module SoftDeletions
  # @see SoftDeletable#async_destroy
  class PurgeJob < ApplicationJob
    queue_as :deletions

    discard_on ActiveJob::DeserializationError, ActiveRecord::RecordNotFound, ActiveRecord::RecordNotDestroyed,
                SoftDeletions::Unpurgeable

    # @param [SoftDeletable] record
    # @return [void]
    def perform(record)
      record.soft_deletion_purge!
    end
  end
end
