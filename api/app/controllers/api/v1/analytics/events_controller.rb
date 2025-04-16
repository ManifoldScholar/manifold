# frozen_string_literal: true

module API
  module V1
    module Analytics
      class EventsController < Ahoy::BaseController
        before_action :fetch_visit

        def create
          @outcome = ::Analytics::RecordEvent.record_event analytics_attributes
          @outcome.valid? ? head(:no_content) : render(json: { errors: @outcome.errors.messages }, status: :bad_request)
        end

        private

        def fetch_visit
          @analytics_visit = ::Analytics::FetchVisit.run! request: request
          head :not_found if @analytics_visit.blank?
        end

        def analytics_attributes
          analytics_params[:data][:attributes].to_h.merge(analytics_visit: @analytics_visit)
        end
      end
    end
  end
end
