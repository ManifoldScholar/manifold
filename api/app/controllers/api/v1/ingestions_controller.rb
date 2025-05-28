# frozen_string_literal: true

module API
  module V1
    # {Ingestion} controller
    class IngestionsController < ApplicationController
      before_action :set_project

      resourceful! Ingestion, authorize_options: {
        except: [
          :show,
          :create,
          :update,
          :reset,
          :process_ingestion,
          :reingest,
          :show_messages
        ]
      } do
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

      def reset
        @ingestion = load_ingestion
        @ingestion.reset
        @ingestion.save
      end

      def process_ingestion
        @ingestion = load_ingestion
        Ingestions::ProcessIngestionJob.perform_later(@ingestion.id, current_user)
      end

      def reingest
        @ingestion = load_ingestion
        Ingestions::ReingestIngestionJob.perform_later(@ingestion.id, current_user)
      end

      def show_messages
        @ingestion = load_ingestion
        permitted = params.permit(:starting_at)
        time = DateTime.parse(permitted[:starting_at])
        render_multiple_resources IngestionMessage.where(
          ingestion: @ingestion,
          created_at: time..DateTime.now
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
