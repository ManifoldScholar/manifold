module Analytics
  class RecordLeaveEventJob < ApplicationJob

    attr_reader :visit_id, :record_type, :record_id, :time

    # @param analytics_visit [String] The ID of the existing analytics visit
    # @param record_type [String] The class name of a record associated with this visit and view event
    # @param record_id [String] The ID a record associated with this visit and view event
    # @param time [DateTime] The time that the leave event occurred
    def perform(analytics_visit:, record_type: nil, record_id: nil, time: Time.current)
      @visit_id = analytics_visit
      @record_type = record_type
      @record_id = record_id
      @time = time

      return unless visit

      end_event_if_it_exists
      end_visit
    end

    private

    def visit
      @visit ||= Analytics::Visit.find(visit_id)
    end

    def record
      @record ||=
        if record_type && record_id
          klass = record_type.classify.constantize
          klass.find(record_id)
        end
    end

    def event
      return unless record

      @event ||= Analytics::Event.find_view_event_for(visit: visit, record: record, before_time: time)
    end

    def event_ended_at
      return unless event

      event&.properties&.[](:ended_at)
    end

    def end_event_if_it_exists
      return unless event

      ends_at = [time, event_ended_at].compact.max
      event.properties[:ended_at] = ends_at
      event.save!
    end

    def end_visit
      ends_at = [time, visit.ended_at, event_ended_at].compact.max
      visit.update_attribute(:ended_at, ends_at)
    end

  end
end
