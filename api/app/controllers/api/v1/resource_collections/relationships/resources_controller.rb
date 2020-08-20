module API
  module V1
    module ResourceCollections
      module Relationships
        # Responds with resources in a collection
        class ResourcesController < ApplicationController

          before_action :set_collection, only: [:index]

          resourceful! Resource, authorize_options: { except: [:index, :show] } do
            ids = @collection.resources.pluck(:id)
            Resource.filtered(
              with_pagination!(resource_filter_params),
              scope: Resource.all.where("resources.id IN (?)", ids)
            )
          end

          # GET /resources
          def index
            @resources = load_zresources
            render_multiple_resources(
              @resources,
              include: %w(collection_resources),
              meta: { pagination: pagination_dict(@resources) },
              location: location
            )
          end

          def show
            @resource = load_zresource
            render_single_resource(@resource)
          end

          private

          def location
            api_v1_resource_collection_relationships_resources_url(@collection)
          end

          def set_collection
            @collection = ResourceCollection.friendly
              .find(params[:resource_collection_id])
          end

        end
      end
    end
  end
end
