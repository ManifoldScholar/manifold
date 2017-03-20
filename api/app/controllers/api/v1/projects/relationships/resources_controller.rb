module Api
  module V1
    module Projects
      module Relationships
        # Responds with resources in a project
        class ResourcesController < ApplicationController

          before_action :set_project, only: [:index, :create]

          resourceful! Resource, authorize_options: { except: [:index] } do
            Resource.filter(
              with_pagination!(resource_filter_params),
              scope: @project.resources
            )
          end

          def index
            @resources = load_resources
            render_multiple_resources(@resources, each_serializer: ResourceSerializer)
          end

          def create
            @resource = ::Updaters::Resource.new(resource_params)
                                            .update(@project.resources.new)
            @resource.creator = @current_user
            @resource.save
            authorize_action_for @resource
            location = api_v1_project_relationships_resources_url(
              @resource,
              project_id: @project.id
            )
            render_single_resource @resource, location: location
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
