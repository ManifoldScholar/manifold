module API
  module V1
    module Projects
      module Relationships
        class AbstractProjectChildController < ApplicationController

          before_action :set_project
          before_action :authorize_project

          private

          def authorize_project
            return unless has_project?
            return if @project.fully_readable_by?(current_user)

            violation = ::Authority::SecurityViolation.new(authority_user, action_name, @project)
            authority_forbidden_resource_instance(violation)
          end

          def has_project?
            params.key? :project_id
          end

          def set_project
            id = params[:project_id]
            @project = Project.friendly.find(id) if id
          end

        end
      end
    end
  end
end
