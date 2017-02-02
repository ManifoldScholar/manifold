module Api
  module V1
    module Projects
      module Relationships
        # Responds with uncollected in a project
        class UncollectedResourcesController < ApplicationController
          before_action :set_project, only: [:index]

          resourceful! Resource, authorize_options: { except: [:index] } do
            @project.uncollected_resources
                    .query(with_pagination!(resource_filter_params))
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
            @project = Project.find(params[:project_id])
          end

        end
      end
    end
  end
end
