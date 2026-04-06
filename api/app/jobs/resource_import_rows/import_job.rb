# frozen_string_literal: true

# Simple job to process a resource import row
module ResourceImportRows
  class ImportJob < ApplicationJob
    include GoodJob::ActiveJobExtensions::Concurrency

    good_job_control_concurrency_with(
      perform_limit: 3,
      key: -> { "ResourceImportRows::ImportJob" }
    )

    queue_as :low_priority

    retry_on ::Google::Apis::RateLimitError,
             wait: :exponentially_longer,
             attempts: 10

    # Statesman gem does not seem to be threadsafe.
    # https://github.com/gocardless/statesman/issues/201
    retry_on ::Statesman::TransitionConflictError,
             wait: 0.5.seconds,
             attempts: 6

    # rubocop:disable Lint/SafeNavigationChain
    rescue_from(Google::Apis::RateLimitError) do |_e|
      rir = ResourceImportRow.find(arguments[0])
      rir&.state_machine.transition_to(:failed)
      Rails.logger.warn(
        "Resource Import: Google ratelimit error for row ##{rir.line_number}"
      )
    end

    def perform(resource_import_row_id)
      rir = ResourceImportRow.find(resource_import_row_id)
      return unless rir&.state_machine.can_transition_to?(:importing)

      rir.state_machine.transition_to(:importing)
    end
    # rubocop:enable Lint/SafeNavigationChain
  end
end
