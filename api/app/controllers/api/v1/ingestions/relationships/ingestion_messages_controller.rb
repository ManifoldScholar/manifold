# frozen_string_literal: true

module API
  module V1
    module Ingestions
      module Relationships
        class IngestionMessagesController < ApplicationController
          before_action :set_project

          resourceful! Ingestion do
            @project.nil? ? Ingestion : @project.ingestions
          end

          def index
            @ingestion = load_ingestion
            permitted = params.permit(:starting_at)
            time = permitted[:starting_at] ? DateTime.parse(permitted[:starting_at]) : DateTime.new
            render_multiple_resources @ingestion.ingestion_messages.where(
              created_at: time..DateTime.now
            )
          end

          private

          def set_project
            @project = Project.friendly.find(params[:project_id]) if params[:project_id]
          end
        end
      end
    end
  end
end
