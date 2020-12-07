module Api
  module V1
    class AnalyticsController < ApplicationController

      before_action :authorize_user

      def show
        scope = analytics_scope

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
        outcome = Analytics::RecordCustomEvent.run custom_event_params.to_h.merge(user: current_user)
        head(outcome.valid? ? 200 : 400)
      end

      def leave
        outcome = Analytics::RecordLeaveEvent.run leave_params.to_h.merge(user: current_user)
        head(outcome.valid? ? 200 : 400)
      end

      private

      def analytics_params
        params.permit(:record_type, :record_id, :start_date, :end_date, analytics: [])
      end

      def custom_event_params
        params.permit(:visit_token, :visitor_token, :name, :properties)
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

      def authorize_user
        authorize_action_for Settings.instance
      end

    end
  end
end
