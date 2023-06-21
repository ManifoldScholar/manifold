module Analytics
  class RecordCustomEvent < Analytics::RecordScopedEvent

    string :name, default: nil
    hash :properties, strip: false, default: {}
    time :time, default: Time.current

    def valid_name
      name
    end

    def execute
      props = if valid_record.present?
                properties.merge({ valid_record.model_name.param_key => valid_record.id })
              else
                properties
              end

      Analytics::Event.create(
        visit: valid_analytics_visit,
        name: valid_name,
        properties: props,
        time: time
      )
    end

  end
end
