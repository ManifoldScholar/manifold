# frozen_string_literal: true

module JobConcurrency
  extend ActiveSupport::Concern

  included do
    include GoodJob::ActiveJobExtensions::Concurrency
  end

  module ClassMethods
    # @param [:model, :job, Proc] by
    # @return [void]
    def unique_job!(by: :job)
      key = unique_job_key_for(by:)

      good_job_control_concurrency_with(
        total_limit: 1,
        key:,
      )
    end

    # @param [:model, :job, Proc] by
    # @return [Proc]
    def unique_job_key_for(by: nil)
      return by if by.kind_of?(Proc)

      case by
      in :model
        -> { "#{self.class.name}-#{arguments.first.to_global_id}" }
      in :job
        -> { self.class.name.to_s }
      end
    end
  end
end
