module API
  module V1
    class AnalyticsController < Ahoy::BaseController

      def show
        scope = analytics_scope

        AnalyticsResultAuthorizer.readable_by? current_user, scope: scope

        interaction_outcome = case scope
                              when nil
                                Analytics::Reports::Global.run(allow_cached_result: false, **analytics_params)
                              else
                                reporter_class = "Analytics::Reports::For#{scope.class.name}".constantize
                                reporter_class.run scope: scope, **analytics_params.to_h.symbolize_keys
                              end

        render_jsonapi(interaction_outcome.result, serializer: ::V1::AnalyticsResultSerializer)
      end

      def create
        ahoy.track_visit

        @outcome = Analytics::RecordCustomEvent.run custom_event_params.to_h.merge(analytics_visit: ahoy.visit)
        head(@outcome.valid? ? 200 : 400)
      end

      def leave
        ahoy.track_visit

        outcome = Analytics::RecordLeaveEvent.run leave_params.to_h.merge(analytics_visit: ahoy.visit)
        head(outcome.valid? ? 200 : 400)
      end

      private

      def analytics_params
        params.permit(:record_type, :record_id, :start_date, :end_date, analytics: [])
      end

      def custom_event_params
        params.permit(:visit_token, :visitor_token, :name, properties: {})
      end

      def leave_params
        params.permit(:visit_token, :visitor_token, :record_type, :record_id)
      end

      def analytics_scope
        return unless analytics_params[:record_type].present? && analytics_params[:record_id].present?

        scope_class = analytics_params[:record_type].safe_constantize
        return head(400) unless scope_class.present?

        scope_class.find(analytics_params[:record_id])
      end

    end
  end
end
