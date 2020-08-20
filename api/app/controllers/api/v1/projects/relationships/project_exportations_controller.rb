module API
  module V1
    module Projects
      module Relationships
        class ProjectExportationsController < AbstractProjectChildController

          resourceful! ProjectExportation do
            ProjectExportation.filtered(with_pagination!({}), scope: @project.project_exportations)
          end

          def index
            @exports = load_project_exportations
            render_multiple_resources @exports.by_created_at(:desc), include: [:export_target]
          end

        end
      end
    end
  end
end
