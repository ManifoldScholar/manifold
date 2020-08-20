module API
  module V1
    module Me
      module Relationships
        # Favorite Projects controller
        class FavoriteProjectsController < ApplicationController

          before_action :authenticate_request!

          resourceful! Project do
            Project.filtered(
              with_pagination!(project_filter_params),
              scope: current_user.favorite_projects.includes(:creators)
            )
          end

          # GET /projects
          def index
            @projects = load_projects
            render_multiple_resources @projects, include: [:creators]
          end

        end
      end
    end
  end
end
