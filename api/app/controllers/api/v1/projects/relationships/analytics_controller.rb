module Api
  module V1
    module Projects
      module Relationships
        # Responds with resources in a project
        class AnalyticsController < ApplicationController

          resourceful! Analytics::Project::Response

          def show
            project = Project.friendly.find(params[:project_id])
            run = Analytics::Project::Fetch.run(project: @project)
            render_single_resource run.result,
                                   serializer: ::V1::ProjectAnalyticsSerializer
          end

        end
      end
    end
  end
end
