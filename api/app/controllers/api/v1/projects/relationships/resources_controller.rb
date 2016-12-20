module Api
  module V1
    module Projects
      module Relationships
        # Responds with resources in a project
        class ResourcesController < ApplicationController

          before_action :set_project, only: [:index]

          resourceful! Resource, authorize_options: { except: [:index] } do
            @project.resources
                    .filtered(resource_filter_params[:filter])
                    .page(page_number)
                    .per(page_size)
          end

          def index
            @resources = load_resources
            render_multiple_resources(@resources, each_serializer: ResourceSerializer)
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
