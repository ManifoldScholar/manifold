module Analytics
  class RecordCustomEvent < Analytics::RecordScopedEvent

    string :name
    hash :properties, strip: false, default: {}
    time :time, default: Time.current

    def execute
      props = if record.present?
                properties.merge({ record.model_name.param_key => record.id })
              else
                properties
              end

      Analytics::Event.create(
        visit: analytics_visit,
        name: name,
        properties: props,
        time: time
      )
    end

  end
end
