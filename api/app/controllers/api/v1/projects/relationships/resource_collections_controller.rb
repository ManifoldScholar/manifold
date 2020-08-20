module API
  module V1
    module Projects
      module Relationships
        # Responds with resources in a project
        class ResourceCollectionsController < AbstractProjectChildController

          resourceful! ResourceCollection, authorize_options: { except: [:index] } do
            ResourceCollection.filtered(
              with_pagination!(resource_collection_filter_params),
              scope: @project.resource_collections
            )
          end

          def index
            @collections = load_resource_collections
            render_multiple_resources(@collections)
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

        end
      end
    end
  end
end
