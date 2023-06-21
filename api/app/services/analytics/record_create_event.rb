module Analytics
  class RecordCreateEvent < Analytics::RecordScopedEvent

    def execute
      Analytics::Event.find_or_create_event_for visit: valid_analytics_visit,
                                                record: valid_record,
                                              event_name: Analytics::Event.event_name_for(:create, valid_record.class)
    end

  end
end
