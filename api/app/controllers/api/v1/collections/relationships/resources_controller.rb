module Api
  module V1
    module Collections
      module Relationships
        # Responds with resources in a collection
        class ResourcesController < ApplicationController

          before_action :set_collection, only: [:index]

          resourceful! Resource, authorize_options: { except: [:index, :show] } do
            @collection.resources
                       .filtered(resource_filter_params[:filter])
                       .page(page_number)
                       .per(page_size)
          end

          # GET /resources
          def index
            @resources = load_zresources
            render_multiple_resources(
              @resources,
              each_serializer: ResourceSerializer,
              meta: { pagination: pagination_dict(@resources) },
              location: api_v1_collection_relationships_resources_url(@collection)
            )
          end

          def show
            @resource = load_zresource
            render_single_resource(@resource)
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
