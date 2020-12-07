module Analytics
  class RecordLeaveEvent < Analytics::RecordScopedEvent

    def execute
      Analytics::RecordLeaveEventJob.perform_later(job_params)
    end

    private

    def job_params
      inputs.slice(:analytics_visit, :record_id, :record_type).compact.transform_values(&:id)
        .merge(time: Time.current)
    end

  end
end
