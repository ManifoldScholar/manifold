module API
  module V1
    module Projects
      module Relationships
        class VersionsController < AbstractProjectChildController

          resourceful! Version, authorize_options: { except: [:index] } do
            Version.filtered(
              with_pagination!(version_filter_params),
              scope: Version.for_item(@project).with_actor
            )
          end

          def index
            authorize_action_for Version, for: @project
            @versions = load_versions
            render_multiple_resources(
              @versions,
              location: api_v1_project_relationships_versions_url(@project),
              serializer: ::V1::VersionSerializer
            )
          end

        end
      end
    end
  end
end
