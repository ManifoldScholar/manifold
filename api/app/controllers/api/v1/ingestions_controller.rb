module API
  module V1
    # {Ingestion} controller
    class IngestionsController < ApplicationController
      before_action :set_project

      resourceful! Ingestion, authorize_options: { except: [:show, :create, :update] } do
        @project.nil? ? Ingestion : @project.ingestions
      end

      # GET /ingestions/1
      def show
        @ingestion = load_ingestion
        authorize_action_for @ingestion
        render_single_resource(
          @ingestion,
          include: [:creator],
          location: location(@ingestion)
        )
      end

      def create
        @ingestion = ::Updaters::Ingestion
          .new(ingestion_params)
          .update_without_save(@project.ingestions.new)
        @ingestion.creator = current_user
        authorize_action_for @ingestion
        @ingestion.save
        render_single_resource(
          @ingestion,
          include: [:creator],
          location: location(@ingestion)
        )
      end

      def update
        @ingestion = load_and_authorize_ingestion
        ::Updaters::Ingestion.new(ingestion_params).update(@ingestion)
        render_single_resource(
          @ingestion,
          location: location(@ingestion)
        )
      end

      private

      def location(_ingestion)
        # TODO: Return a proper location
        ""
      end

      def set_project
        @project = Project.friendly.find(params[:project_id]) if params[:project_id]
      end
    end
  end
end
