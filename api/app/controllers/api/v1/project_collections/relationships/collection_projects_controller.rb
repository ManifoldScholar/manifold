module Api
  module V1
    module ProjectCollections
      module Relationships
        class CollectionProjectsController < ApplicationController

          before_action :set_project_collection, only: [:index, :update]

          INCLUDES = %w(creators contributors project).freeze

          resourceful! CollectionProject,
                       authorize_options: { except: [:index, :show] } do
            includes = [:creators, :contributors, :project]

            @project_collection.collection_projects
                               .includes(includes)
                               .page(page_number)
                               .per(page_size)
          end

          # GET /resources
          def index
            @collection_projects = load_collection_projects
            render_multiple_resources(
              @collection_projects,
              include: INCLUDES,
              each_serializer: CollectionProjectSerializer,
              meta: { pagination: pagination_dict(@collection_projects) },
              location: location
            )
          end

          def update
            @collection_project = load_and_authorize_collection_project
            ::Updaters::Default.new(collection_project_params).update(@collection_project)
            render_single_resource(@collection_project,
                                   include: INCLUDES,
                                   location: location)
          end

          private

          def set_project_collection
            @project_collection = ProjectCollection.friendly
                                                   .find(params[:project_collection_id])
          end

          # rubocop:disable Metrics/LineLength
          def location
            api_v1_project_collection_relationships_collection_projects_url(@project_collection)
          end
          # rubocop:enable Metrics/LineLength

        end
      end
    end
  end
end
