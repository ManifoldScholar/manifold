module Api
  module V1
    # Texts controller
    class IngestionsController < ApplicationController
      before_action :set_project

      resourceful! Ingestion do
        @project.nil? ? Ingestion : @project.ingestions
      end

      # GET /ingestions/1
      def show
        @ingestion = load_ingestion
        render_single_resource(
          @ingestion,
          includes: :text,
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
          include: [:creator, :text],
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
