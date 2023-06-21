module Analytics
  class RecordLeaveEvent < Analytics::RecordScopedEvent

    def execute
      Analytics::RecordLeaveEventJob.perform_later(job_params)
    end

    private

    def job_params
      {
        analytics_visit: valid_analytics_visit.id,
        record_id: record_id,
        record_type: record_type,
        time: Time.current
      }
    end

  end
end
