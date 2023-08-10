module API
  module V1
    # Trigger ingestion processing via the API
    class IngestsController < ApplicationController
      before_action :set_project, only: [:create]
      before_action :set_text, only: [:create]

      resourceful! Ingestion do
        @project&.ingestions
        @text&.ingestions
      end

      # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
      def create
        parent = @project || @text
        @ingestion = ::Updaters::Ingestion
          .new(ingestion_params)
          .update_without_save(parent.ingestions.new)

        @ingestion.creator = current_user

        if @project
          @ingestion.project_id = @project.id
          @ingestion.target_kind = "text"
        elsif @text
          @project = Project.find(@text.project_id)
          @ingestion.project_id = @project.id
          @ingestion.target_kind = "text_section"
          @ingestion.text_section_id = params[:data][:relationships][:text_section]
        end

        if @ingestion.save
          @ingestion.process(current_user)

          render_single_resource Text.find(@ingestion.text_id), serializer: ::V1::TextSerializer
        else
          render_single_resource @ingestion, serializer: ::V1::IngestionSerializer
        end
      end
      # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

      private

      def set_project
        @project = Project.friendly.find(params[:id], allow_nil: true)
      end

      def set_text
        @text = Text.friendly.find(params[:id], allow_nil: true)
      end
    end
  end
end
