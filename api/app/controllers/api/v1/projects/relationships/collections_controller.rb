module Api
  module V1
    module Projects
      module Relationships
        # Responds with resources in a project
        class CollectionsController < ApplicationController

          before_action :set_project, only: [:index, :create]

          resourceful! Collection, authorize_options: { except: [:index] } do
            Collection.filter(
              with_pagination!(collection_filter_params),
              scope: @project.collections
            )
          end

          def index
            @collections = load_collections
            render_multiple_resources(@collections, each_serializer: CollectionSerializer)
          end

          def create
            @collection = ::Updaters::Collection.new(collection_params)
                                                .update(@project.collections.new)
            @collection.save
            authorize_action_for @collection
            location = api_v1_project_relationships_collections_url(
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
