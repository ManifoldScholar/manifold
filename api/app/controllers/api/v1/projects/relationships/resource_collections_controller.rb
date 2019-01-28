module Api
  module V1
    module Projects
      module Relationships
        # Responds with resources in a project
        class ResourceCollectionsController < ApplicationController

          before_action :set_project, only: [:index, :create]

          resourceful! ResourceCollection, authorize_options: { except: [:index] } do
            ResourceCollection.filter(
              with_pagination!(resource_collection_filter_params),
              scope: @project.resource_collections
            )
          end

          def index
            @collections = load_resource_collections
            render_multiple_resources(@collections,
                                      each_serializer: ResourceCollectionSerializer)
          end

          def create
            updater = ::Updaters::ResourceCollection.new(resource_collection_params)
            @collection = updater.update(@project.resource_collections.new)
            @collection.save
            authorize_action_for @collection
            location = api_v1_project_relationships_resource_collections_url(
              @collection,
              project_id: @project.id
            )
            render_single_resource @collection, location: location
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
