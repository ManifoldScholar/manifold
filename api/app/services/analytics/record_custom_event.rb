module Analytics
  class RecordCustomEvent < Analytics::RecordEvent

    string :name
    hash :properties, strip: false
    time :time, default: Time.current

    def execute      
      Analytics::Event.create(
        visit: analytics_visit,
        name: name,
        properties: properties,
        time: time
      )
    end

  end
end
