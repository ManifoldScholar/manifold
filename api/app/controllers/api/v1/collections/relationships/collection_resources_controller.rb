module Api
  module V1
    module Collections
      module Relationships
        # Responds with resources in a collection
        class CollectionResourcesController < ApplicationController
          before_action :set_collection, only: [:index]

          # GET /resources
          def index
            @collection_resources = @collection.collection_resources
                                               .page(page_number)
                                               .per(page_size)
            render json: @collection_resources,
                   include: %w(resource),
                   each_serializer: CollectionResourceSerializer,
                   meta: { pagination: pagination_dict(@collection_resources) }
          end

          private

          def set_collection
            @collection = Collection.find(params[:collection_id])
          end

        end
      end
    end
  end
end
