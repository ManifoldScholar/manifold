module Api
  module V1
    # resources controller
    class ResourcesController < ApplicationController

      INCLUDES = [:project].freeze

      resourceful! Resource, authorize_options: { except: [:index, :show] } do
        Resource
          .filter(with_pagination!(resource_filter_params))
      end

      def index
        @resources = load_zresources
        render_multiple_resources(
          @resources,
          each_serializer: ResourceSerializer
        )
      end

      def show
        @resource = load_zresource
        render_single_resource(@resource, include: INCLUDES)
      end

      def create
        @resource = authorize_and_create_zresource(resource_params)
        render_single_resource @resource
      end

      def update
        @resource = load_and_authorize_zresource
        ::Updaters::Resource.new(resource_params).update(@resource)
        render_single_resource(@resource, include: INCLUDES)
      end

      def destroy
        @resource.destroy
      end

    end
  end
end
