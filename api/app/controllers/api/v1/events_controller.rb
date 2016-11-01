module Api
  module V1
    # Events controller
    class EventsController < ApplicationController
      before_action :set_project, only: [:index]

      # GET /projects/:project_id/events
      def index
        @events = @project.events.page(page_number).per(page_size)
        render json: @events,
               each_serializer: EventSerializer,
               meta: { pagination: pagination_dict(@events) }
      end

      private

      def set_project
        @project = Project.find(params[:project_id])
      end
    end
  end
end
