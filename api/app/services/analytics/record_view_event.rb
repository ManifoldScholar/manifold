module Analytics
  class RecordViewEvent < Analytics::RecordScopedEvent

    def execute
      Analytics::Event.find_or_create_view_event_for(visit: analytics_visit, record: scope)
    end

  end
end
