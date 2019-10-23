module Api
  module V1
    module Projects
      module Relationships
        # Responds with categories in a project
        class TextCategoriesController < ApplicationController

          LOCATION = [:api, :v1, :project, :relationships, :text_categories].freeze

          before_action :set_project

          resourceful! Category, authorize_options: { except: [:index] } do
            @project.text_categories
          end

          def index
            @categories = load_categories
            render_multiple_resources(
              @categories,
              each_serializer: CategorySerializer,
              location: api_v1_project_relationships_text_categories_url(@project)
            )
          end

          def create
            @category = authorize_and_create_category(category_params)
            render_single_resource(@category, location: LOCATION)
          end

          def show
            @category = load_and_authorize_category
            render_single_resource(@category, location: LOCATION)
          end

          private

          def scope_for_categories
            @project.text_categories
          end

          def set_project
            @project = Project.friendly.find(params[:project_id])
          end

        end
      end
    end
  end
end
