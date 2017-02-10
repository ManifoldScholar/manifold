module Api
  module V1
    module Projects
      module Relationships
        # Responds with resources in a project
        class ResourcesController < ApplicationController

          before_action :set_project, only: [:index, :create]

          resourceful! Resource, authorize_options: { except: [:index] } do
            filter_params =
              with_pagination!(resource_filter_params).merge(project: @project.id)
            Resource.filter(with_pagination!(filter_params))
          end

          def index
            @resources = load_resources
            render_multiple_resources(@resources, each_serializer: ResourceSerializer)
          end

          def create
            @resource = authorize_and_create_zresource(resource_params)
            render_single_resource @resource
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
