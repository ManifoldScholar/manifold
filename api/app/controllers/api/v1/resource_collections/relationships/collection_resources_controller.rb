module API
  module V1
    module ResourceCollections
      module Relationships
        # Responds with resources in a collection
        class CollectionResourcesController < ApplicationController

          LOCATION = [:api, :v1, :resource_collection_relationships,
                      :collection_resources].freeze

          before_action :set_collection, only: [:index, :show]

          resourceful! CollectionResource,
                       authorize_options: { except: [:index, :show] } do
            @collection.collection_resources
              .page(page_number)
              .per(page_size)
          end

          def index
            @collection_resources = load_collection_resources
            render_multiple_resources(
              @collection_resources,
              include: %w(resource),
              meta: { pagination: pagination_dict(@collection_resources) },
              location: LOCATION
            )
          end

          def show
            @collection_resource = load_collection_resource
            render_single_resource(
              @collection_resource,
              include: %w(resource)
            )
          end

          private

          def set_collection
            @collection = ResourceCollection.friendly
              .find(params[:resource_collection_id])
          end

        end
      end
    end
  end
end
