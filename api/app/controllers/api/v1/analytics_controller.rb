module API
  module V1
    class AnalyticsController < Ahoy::BaseController

      before_action :fetch_visit, only: :create
      before_action :get_report_type, only: :show

      def show
        scope = analytics_scope

        AnaylticsReportAuthorizer.readable_by? current_user, scope: scope

        hashed_params = analytics_filter_params.to_h.symbolize_keys
        interaction_outcome = @report_type.reporter.run(allow_cached_result: false, **hashed_params, **with_pagination!(hashed_params))

        options = { pagination: interaction_outcome.respond_to?(:pagination) ? interaction_outcome.pagination : nil }.compact
        render_jsonapi(interaction_outcome.result, serializer: ::V1::AnalyticsResultSerializer, **options)
      end

      def create
        @outcome = Analytics::RecordEvent.record_event analytics_attributes
        @outcome.valid? ? head(204) : render(json: { errors: @outcome.errors.messages }, status: 400)
      end

      private

      def fetch_visit
        @analytics_visit = Analytics::FetchVisit.run! request: request
      end

      def get_report_type
        @report_type = AnalyticsReportType.build(params[:report_type])
        head 404 unless @report_type.is_a?(AnalyticsReportType)
      end

      def analytics_attributes
        analytics_params[:data][:attributes].to_h.merge(analytics_visit: @analytics_visit)
      end

      def analytics_scope
        return unless analytics_filter_params[:record_type].present? && analytics_filter_params[:record_id].present?

        scope_class = analytics_filter_params[:record_type].safe_constantize
        return head(400) unless scope_class.present?

        scope_class.find(analytics_filter_params[:record_id])
      end

    end
  end
end
