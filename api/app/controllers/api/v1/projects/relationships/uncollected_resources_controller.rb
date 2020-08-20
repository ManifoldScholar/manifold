module API
  module V1
    module Projects
      module Relationships
        # Responds with uncollected in a project
        class UncollectedResourcesController < AbstractProjectChildController

          resourceful! Resource, authorize_options: { except: [:index] } do
            Project.filtered(
              with_pagination!(resource_filter_params),
              scope: @project.uncollected_resources
            )
          end

          # GET /resources
          def index
            @resources = load_resources
            render_multiple_resources(
              @resources
            )
          end

        end
      end
    end
  end
end
