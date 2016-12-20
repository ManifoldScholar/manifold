module Api
  module V1
    module Me
      module Relationships
        # Favorite Projects controller
        class FavoriteProjectsController < ApplicationController

          resourceful! Project do
            @current_user.favorite_projects.includes(:creators, :collaborators)
          end

          # GET /projects
          def index
            @projects = load_projects
            render_multiple_resources(
              @projects, include: %w(creators collaborators),
                         each_serializer: ProjectPartialSerializer
            )
          end

        end
      end
    end
  end
end
