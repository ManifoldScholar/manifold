module API
  module V1
    module Texts
      module Relationships
        class TextSectionIngestionsController < ApplicationController
          before_action :set_text, only: [:create]

          resourceful! Ingestion do
            @text.text_sections
          end

          def create
            @ingestion = ::Updaters::Ingestion
              .new(ingestion_params)
              .update_without_save(@text.ingestions.new)
            @ingestion.creator = current_user
            @ingestion.project_id = @text.project_id
            @ingestion.target_kind = "text_section"
            @ingestion.text_section_id = params[:data][:relationships][:text_section]
            authorize_action_for @ingestion
            @ingestion.save
            render_single_resource(
              @ingestion,
              include: [:creator]
            )
          end

          private

          def set_text
            @text = Text.friendly.find(params[:text_id])
          end
        end
      end
    end
  end
end
