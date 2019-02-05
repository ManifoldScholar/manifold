# Simple job to process a resource import row
module ResourceImportRows
  class ImportJob < ApplicationJob

    # Our acceptance tests use perform_now, which break if this is throttled.
    unless Rails.env.test?
      # concurrency 6, drop: false
      throttle threshold: 3, period: 0.5.seconds, drop: false
    end

    queue_as :low_priority

    include ActiveJob::Retry.new(
      strategy: :exponential,
      limit: 10,
      retryable_exceptions: [::Google::Apis::RateLimitError]
    )

    # Statesman gem does not seem to be threadsafe.
    # https://github.com/gocardless/statesman/issues/201
    include ActiveJob::Retry.new(
      strategy: :constant,
      limit: 6,
      delay: 0.5.seconds,
      retryable_exceptions: [::Statesman::TransitionConflictError]
    )

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
