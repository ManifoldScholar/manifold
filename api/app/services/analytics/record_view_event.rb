module Analytics
  class RecordViewEvent < Analytics::RecordScopedEvent

    def execute
      Analytics::Event.create_view_event_for(visit: valid_analytics_visit, record: valid_record)
    end

  end
end
