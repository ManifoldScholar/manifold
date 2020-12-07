module API
  module V1
    module Analytics
      class EventsController < Ahoy::BaseController

        before_action :fetch_visit

        def create
          @outcome = ::Analytics::RecordEvent.record_event analytics_attributes
          @outcome.valid? ? head(204) : render(json: { errors: @outcome.errors.messages }, status: 400)
        end

        private

        def fetch_visit
          @analytics_visit = ::Analytics::FetchVisit.run! request: request
          head 404 if @analytics_visit.blank?
        end

        def analytics_attributes
          analytics_params[:data][:attributes].to_h.merge(analytics_visit: @analytics_visit)
        end

      end
    end
  end
end
