module API
  module V1
    module Projects
      module Relationships
        # Responds with resources in a project
        class ResourcesController < AbstractProjectChildController

          resourceful! Resource, authorize_options: { except: [:index] } do
            Resource.filtered(
              with_pagination!(resource_filter_params),
              scope: @project.resources
            )
          end

          def index
            @resources = load_resources
            render_multiple_resources @resources
          end

          def create
            @resource = ::Updaters::Resource.new(resource_params)
              .update(@project.resources.new,
                      creator: @current_user)
            @resource.save
            authorize_action_for @resource
            location = api_v1_project_relationships_resources_url(
              @resource,
              project_id: @project.id
            )
            render_single_resource @resource, location: location
          end

        end
      end
    end
  end
end
