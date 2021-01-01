module API
  module V1
    class AnalyticsController < Ahoy::BaseController
      include Validation

      before_action :fetch_visit, only: :create

      def show
        subject = analytics_subject

        AnalyticsResultAuthorizer.readable_by? current_user, subject: subject

        interaction_outcome = case subject
                              when nil
                                Analytics::Reports::Global.run(allow_cached_result: false, **analytics_params)
                              else
                                reporter_class = "Analytics::Reports::For#{subject.class.name}".constantize
                                reporter_class.run subject: subject, **get_analytics_params.to_h.symbolize_keys
                              end

        render_jsonapi(interaction_outcome.result, serializer: ::V1::AnalyticsResultSerializer)
      end

      def create
        errors = []
        events = []

        create_analytics_event_params.each do |event|
          outcome = Analytics::RecordEvent.record_event event.to_h.merge(analytics_visit: @analytics_visit)
          outcome.valid? ? events.push(outcome.result) : errors.push(outcome.errors)
        end

        render_jsonapi({ events: events, errors: errors }, serializer: ::V1::AnalyticsEventSerializer)
      end

      private

      def fetch_visit
        @analytics_visit = Analytics::FetchVisit.run! request: request
      end

      def analytics_subject
        return unless get_analytics_params[:subject].present? && get_analytics_params[:subject_id].present?

        subject_class = get_analytics_params[:subject].classify.safe_constantize
        return head(400) unless subject_class.present?

        subject_class.find(get_analytics_params[:subject_id])
      end

    end
  end
end
