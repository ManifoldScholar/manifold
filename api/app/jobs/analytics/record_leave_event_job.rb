module Analytics
  class RecordLeaveEventJob < ApplicationJob

    def perform(params)
      time = params[:time] || Time.current

      if record(params).present?
        view_event = Analytics::Event.find_view_event_for(visit: params[:analytics_visit], record: params[:record], before_time: time)

        view_event.properties[:ended_at] = [time, view_event.properties[:ended_at]].max
        view_event.save!
      else
        visit = Analytics::Visit.find_by(visit_token: params[:visit_token])

        visit.update_attribute(:ended_at, [time, view_event.properties[:ended_at]].max)
      end
    end

    def record(params)
      return @record if @record.present?
      return unless params[:record_type] && params[:record_id]

      klass = params[:record_type].classify.constantize
      @record = klass.find(params[:record_id])
    end

  end
end
