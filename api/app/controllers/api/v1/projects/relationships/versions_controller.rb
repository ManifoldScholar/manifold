module Api
  module V1
    module Projects
      module Relationships
        class VersionsController < ApplicationController
          before_action :set_project, only: [:index]

          resourceful! Version, authorize_options: { except: [:index] } do
            Version.filter(
              with_pagination!(version_filter_params),
              scope: Version.for_item(@project).with_actor
            )
          end

          def index
            authorize_action_for Version, for: @project
            @versions = load_versions
            render_multiple_resources(
              @versions,
              each_serializer: VersionSerializer,
              location: api_v1_project_relationships_versions_url(@project)
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
