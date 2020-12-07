module Analytics
  class RecordCreateEvent < Analytics::RecordScopedEvent

    def execute
      Analytics::Event.find_or_create_event_for visit: analytics_visit,
                                                record: record,
                                              event_name: Analytics::Event.event_name_for(:create, record.class)
    end

  end
end
