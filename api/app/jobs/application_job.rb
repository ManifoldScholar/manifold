class ApplicationJob < ActiveJob::Base
  def match_result(result)
    Dry::Matcher::ResultMatcher.(result, &Proc.new)
  end

  def match_result_on_failure(result)
    match_result(result) do |m|
      m.success do
        # This block intentionally left blank
      end

      m.failure(&Proc.new)
    end
  end

  # @!group Advisory Lock Methods

  # @api private
  # @return [void]
  def advisory_locked!
    result = ApplicationRecord.with_advisory_lock_result advisory_lock_key, timeout_seconds: advisory_lock_timeout do
      yield
    end

    retry_job wait: advisory_lock_retry_wait unless result.lock_was_acquired?
  end

  # @abstract
  # @return [String]
  def advisory_lock_key
    self.class.advisory_lock_key
  end

  # @return [ActiveSupport::Duration]
  def advisory_lock_retry_wait
    self.class.advisory_lock_retry_wait
  end

  # @return [Integer]
  def advisory_lock_timeout
    self.class.advisory_lock_timeout
  end

  class << self
    # @return [String]
    def advisory_lock_key
      @advisory_lock_key ||= name.underscore
    end

    def advisory_lock_retry_wait
      @advisory_lock_retry_wait ||= 5.minutes
    end

    attr_writer :advisory_lock_retry_wait

    def advisory_lock_timeout
      @advisory_lock_timeout ||= 60
    end

    attr_writer :advisory_lock_timeout
  end

  # @!endgroup
end
