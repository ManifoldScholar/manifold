module API
  module V1
    class AnalyticsController < Ahoy::BaseController

      before_action :fetch_visit, only: [:create, :leave]

      def show
        scope = analytics_scope

        AnalyticsResultAuthorizer.readable_by? current_user, scope: scope

        interaction_outcome = case scope
                              when nil
                                Analytics::Reports::Global.run(allow_cached_result: false, **get_analytics_params)
                              else
                                reporter_class = "Analytics::Reports::For#{scope.class.name}".constantize
                                reporter_class.run scope: scope, **get_analytics_params.to_h.symbolize_keys
                              end

        render_jsonapi(interaction_outcome.result, serializer: ::V1::AnalyticsResultSerializer)
      end

      def create
        @outcome = Analytics::RecordEvent.record_event create_event_params.to_h.merge(analytics_visit: @analytics_visit)
        @outcome.valid? ? head(200) : render(json: { errors: @outcome.errors.messages }, status: 400)
        # head(@outcome.valid? ? 200 : 400)
      end

      def leave
        ahoy.track_visit

        outcome = Analytics::RecordLeaveEvent.run leave_params.to_h.merge(analytics_visit: @analytics_visit)
        head(outcome.valid? ? 200 : 400)
      end

      private

      def get_analytics_params
        params.permit(:record_type, :record_id, :start_date, :end_date, analytics: [])
      end

      def create_event_params
        params.permit(:record_type, :record_id, :name, :properties, :time, :visit_token, :visitor_token)
      end

      def leave_params
        params.permit(:visit_token, :visitor_token, :record_type, :record_id)
      end

      def fetch_visit
        @analytics_visit = Analytics::FetchVisit.run! request: request
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
