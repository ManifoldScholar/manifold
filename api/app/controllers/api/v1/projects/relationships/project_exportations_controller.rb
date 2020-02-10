module Api
  module V1
    module Projects
      module Relationships
        class ProjectExportationsController < ApplicationController

          before_action :set_project, only: [:index]

          resourceful! ProjectExportation do
            ProjectExportation.filtered(with_pagination!({}), scope: @project.project_exportations)
          end

          def index
            @exports = load_project_exportations
            render_multiple_resources @exports.by_created_at(:desc), include: [:export_target]
          end

          private

          def set_project
            @project = Project.friendly.find(params[:project_id])
          end
        end
      end
    end
  end
end
