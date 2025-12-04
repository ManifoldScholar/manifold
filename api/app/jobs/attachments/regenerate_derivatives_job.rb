# frozen_string_literal: true

module Attachments
  # Regenerate derivatives for a specific attachment on a record.
  class RegenerateDerivativesJob < ApplicationJob
    queue_as :low_priority

    discard_on ActiveRecord::RecordNotFound

    discard_on NoMethodError

    discard_on Shrine::FileNotFound

    retry_on Shrine::AttachmentChanged, attempts: 5, wait: :exponentially_longer

    retry_on WithAdvisoryLock::FailedToAcquireLock, attempts: 5, wait: :exponentially_longer

    around_perform :acquire_attachments_lock!

    # @param [ApplicationRecord] record
    # @param [Symbol] attachment_name
    # @return [void]
    def perform(record, attachment_name)
      attacher = record.public_send(:"#{attachment_name}_attacher")

      # :nocov:
      return unless attacher.stored?
      # :nocov:

      old_derivatives = attacher.derivatives

      attacher.set_derivatives({})
      attacher.create_derivatives

      begin
        attacher.atomic_persist
        attacher.delete_derivatives(old_derivatives)
      rescue Shrine::AttachmentChanged, ActiveRecord::RecordNotFound
        # :nocov:
        attacher.delete_derivatives # remove orphans
        # :nocov:
      end
    end

    private

    # @return [String]
    def attachments_lock_name
      record = arguments.first

      "attachments/derivatives/#{record.model_name}/#{record.id}"
    end

    # @return [void]
    def acquire_attachments_lock!
      ApplicationRecord.with_advisory_lock!(attachments_lock_name, timeout_seconds: 30) do
        yield
      end
    end
  end
end
