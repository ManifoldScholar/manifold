module Analytics
  class RecordLeaveEventJob < ApplicationJob

    def perform(params)
      time = params[:time] || Time.current

      set_event_end(params, time) if record(params).present?
      set_visit_end(params, time)
    end

    def record(params)
      return @record if @record.present?
      return unless params[:record_type] && params[:record_id]

      klass = params[:record_type].classify.constantize
      @record = klass.find(params[:record_id])
    end

    def set_event_end(params, time)
      view_event = Analytics::Event.find_view_event_for(visit: params[:analytics_visit], record: params[:record], before_time: time)

      view_event.properties[:ended_at] = [time, view_event.properties[:ended_at]].max
      view_event.save!
    end

    def set_visit_end(params, time)
      params[:analytics_visit].update_attribute :ended_at,
                                                [time, params[:analytics_visit].ended_at, view_event&.properties&.[](:ended_at)].compact.max
    end

  end
end
