module API
  module V1
    module RecordsAnalytics
      extend ActiveSupport::Concern

      included do
        after_action :record_analytics_event

        def internal_analytics_disabled?
          self.class.internal_analytics_disabled?
        end
      end

      class_methods do
        attr_reader :analytics
        attr_reader :analytics_record_getter

        def internal_analytics_disabled?
          Settings.instance.general[:disable_internal_analytics]
        end

        def record_analytics_for_actions(*action_names, event:)
          # return if internal_analytics_disabled?

          event = AnalyticsEventType.build(event)
          return unless event.is_a?(AnalyticsEventType)

          @analytics = action_names.each_with_object({}.with_indifferent_access) do |action, hsh|
            (hsh[action] ||= []).push(event)
          end
        end

        alias_method :record_analytics_for_action, :record_analytics_for_actions
      end

      def record_analytics_event
        # return if self.internal_analytics_disabled?

        registered_events = self.class.analytics[action_name]

        return unless registered_events.present? &&
                      (self.class.analytics_record_getter.nil? || analytics_record.present?) &&
                      visit.present?

        registered_events.each { |event| trigger_event_interaction(event) }
      end

      private

      def trigger_event_interaction(event)
        event.interaction.run! record: analytics_record,
                                analytics_visit: visit,
                                properties: analytics_params_for(event) || {}
      end

      def analytics_record
        return if self.class.analytics_record_getter.nil?

        if self.class.analytics_record_getter.starts_with?("@")
          instance_variable_get(self.class.analytics_record_getter)
        else
          __send__(self.class.analytics_record_getter)
        end
      end

      def analytics_params_for(event)
        event.analytics_params.present? ? params.slice(*event.analytics_params).to_unsafe_h : params[:analytics_properties]
      end

      def visit
        @visit ||= ::Analytics::FetchVisit.run(request: request, visit_token: visit_token, visitor_token: visitor_token).result
      rescue ActiveRecord::RecordInvalid
        @visit = nil
      end

      def visit_token
        params[:visit_token] || request.headers["HTTP_VISIT_TOKEN"]
      end

      def visitor_token
        params[:visitor_token] || request.headers["HTTP_VISITOR_TOKEN"]
      end
    end
  end
end
