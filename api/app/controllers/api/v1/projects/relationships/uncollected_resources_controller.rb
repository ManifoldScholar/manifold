module Api
  module V1
    module Projects
      module Relationships
        # Responds with uncollected in a project
        class UncollectedResourcesController < ApplicationController
          before_action :set_project, only: [:index]

          resourceful! Resource, authorize_options: { except: [:index] } do
            Project.filter(
              with_pagination!(resource_filter_params),
              scope: @project.uncollected_resources
            )
          end

          # GET /resources
          def index
            @resources = load_resources
            render_multiple_resources(
              @resources,
              each_serializer: ResourceSerializer
            )
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
