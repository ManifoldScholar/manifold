module Api
  module V1
    module Collections
      module Relationships
        # Responds with resources in a collection
        class ResourcesController < ApplicationController
          before_action :set_collection, only: [:index]

          # GET /resources
          def index
            @resources = @collection.resources
                                    .filtered(resource_filter_params[:filter])
                                    .page(page_number)
                                    .per(page_size)
            render json: @resources,
                   each_serializer: ResourceSerializer,
                   meta: { pagination: pagination_dict(@resources) }
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
