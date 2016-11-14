module Api
  module V1
    module Me
      module Relationships
        # Favorite Projects controller
        class FavoriteProjectsController < ApplicationController
          before_action :authenticate_request!

          # GET /projects
          def index
            @projects = @current_user
                        .favorite_projects
                        .includes(:makers, :creators, :contributors)
                        .filtered(filter_params[:filter])
            render json: @projects,
                   include: %w(creators collaborators),
                   each_serializer: ProjectPartialSerializer
          end

          private

          def filter_params
            params.permit(filter: [:featured, :subject])
          end

          # Only allow a trusted parameter "white list" through.
          def project_params
            params.require(:project)
          end

        end
      end
    end
  end
end
