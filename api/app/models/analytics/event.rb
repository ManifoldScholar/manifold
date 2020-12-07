module Analytics
  class Event < ApplicationRecord
    include Ahoy::QueryMethods

    PROJECT_VIEW_EVENT_NAME = "view project".freeze
    SEARCH_EVENT_NAME = "search".freeze

    self.table_name = "analytics_events"

    belongs_to :visit, class_name: "Analytics::Visit"

    before_create :set_time

    class << self
      def create_view_event_for(visit:, record:, start_time: Time.current)
        create visit: visit,
                name: event_name_for(:view, record),
                properties: { record.model_name.param_key => record.id },
                time: start_time
      end

      def find_or_create_event_for(visit:, record:, event_name:)
        find_or_create_by(visit: visit, name: event_name, properties: { record.model_name.param_key => record.id })
      end

      def find_or_create_view_event_for(visit:, record:, start_time: Time.current)
        find_or_create_event_for(visit: visit, record: record, event_name: event_name_for(:view, record)) do |_e|
          properties[:started_at] = start_time
        end
      end

      def find_view_event_for(visit:, record:, before_time:)
        where(before_time.present? ? arel_table[:time].lt(before_time) : nil)
          .find_by visit: visit,
                   name: "view #{record.model_name.param_key}",
                   properties: { record.model_name.param_key => record.id }
      end

      def event_name_for(event, record_class = nil)
        key = record_class&.model_name&.param_key

        "#{event}_#{key}".chomp("_")
      end
    end

    private

    def set_time
      self.time ||= Time.current
    end
  end
end
