module Api
  module V1
    module Collections
      module Relationships
        # Responds with resources in a collection
        class CollectionResourcesController < ApplicationController

          LOCATION = [:api, :v1, :collection_relationships, :collection_resources].freeze

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
              each_serializer: CollectionResourceSerializer,
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
            @collection = Collection.friendly.find(params[:collection_id])
          end

        end
      end
    end
  end
end
