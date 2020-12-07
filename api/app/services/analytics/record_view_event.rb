module Analytics
  class RecordViewEvent < Analytics::RecordScopedEvent

    def execute
      Analytics::Event.create_view_event_for(visit: analytics_visit, record: record)
    end

  end
end
