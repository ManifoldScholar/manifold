module ExclusiveJob
  extend ActiveSupport::Concern

  included do
    around_perform :lock_and_transact!
  end

  # @return [void]
  def lock_and_transact!
    logger.debug "LOCKING"

    result = ApplicationRecord.with_advisory_lock_result(
      exclusive_lock_name,
      timeout_seconds: 30,
      transaction: true
    ) do
      logger.debug "LOCK ACQUIRED"

      yield if block_given?
    end

    logger.debug "LOCK RELEASED"

    return if result.lock_was_acquired?

    logger.warn "LOCK FAILED TO ACQUIRE IN TIME"

    reenqueue 30..60, "lock failed to acquire"
  end

  # @return [String]
  def exclusive_lock_name
    self.class.name
  end
end
