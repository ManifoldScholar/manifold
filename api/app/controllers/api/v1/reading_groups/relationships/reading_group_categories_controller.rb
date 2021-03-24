module API
  module V1
    module ReadingGroups
      module Relationships
        class ReadingGroupCategoriesController < AbstractController
          INCLUDES = %i[projects texts resources resource_collections].freeze

          resourceful! ReadingGroupCategory, authorize_options: { except: [:index, :show] } do
            @reading_group.reading_group_categories.includes(*INCLUDES)
          end

          def index
            @categories = load_reading_group_categories

            render_multiple_resources @categories, includes: INCLUDES, location: location_for(ReadingGroupCategory)
          end

          def show
            @category = load_reading_group_category

            render_single_resource @category, location: location_for(@category)
          end

          def create
            @category = authorize_and_create_reading_group_category reading_group_category_params

            render_single_resource @category, location: location_for(@category)
          end

          def update
            @category = load_and_authorize_reading_group_category

            ::Updaters::ReadingGroupCategory.new(reading_group_category_params).update(@category)

            render_single_resource @category, location: location_for(@category)
          end

          def destroy
            @category = load_and_authorize_reading_group_category

            if @category.destroy
              head :no_content
            else
              render_single_resource @category, location: location_for(@category)
            end
          end

          private

          def location_for(category = @category)
            target = category || ReadingGroupCategory

            url_for([:api, :v1, @reading_group, :relationships, target])
          end

          def reading_group_category_params
            attributes = [:title, :description, :position]
            relationships = [:projects, :resources, :resource_collections, :texts]

            param_config = structure_params(attributes: attributes, relationships: relationships)

            params.require(:data)
            params.permit(param_config)
          end
        end
      end
    end
  end
end
