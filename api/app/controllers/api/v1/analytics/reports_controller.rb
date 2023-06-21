module API
  module V1
    module Analytics
      class ReportsController < ApplicationController

        attr_reader :report_scope, :report_type

        before_action :set_report_type
        rescue_from ActiveRecord::RecordNotFound, with: :respond_with_bad_request

        def show
          return respond_with_bad_request unless valid_report_type?

          outcome = run_report

          render_jsonapi(outcome.result, serializer: ::V1::AnalyticsResultSerializer, **serialization_options(outcome))
        end

        private

        def serialization_options(outcome)
          { meta: { pagination: outcome.respond_to?(:pagination_dict) ? outcome.pagination_dict : nil }.compact }
        end

        def run_report
          report_type.reporter.run(**reporter_inputs)
        end

        def reporter_inputs
          report_params.merge(with_pagination!(report_params)).merge(user: current_user)
        end

        def set_report_type
          @report_type = AnalyticsReportType.build(params[:report_type])
        end

        def report_params
          analytics_filter_params.to_h.symbolize_keys
        end

        def valid_report_type?
          @report_type.is_a?(AnalyticsReportType)
        end

      end
    end
  end
end
