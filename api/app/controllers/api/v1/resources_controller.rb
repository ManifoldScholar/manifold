module Api
  module V1
    # resources controller
    class ResourcesController < ApplicationController

      INCLUDES = [:project].freeze

      resourceful! Resource, authorize_options: { except: [:index, :show] } do
        Resource.filter(with_pagination!(resource_filter_params))
      end

      def index
        @resources = load_zresources
        render_multiple_resources @resources
      end

      def show
        @resource = load_zresource
        render_single_resource @resource,
                               serializer: ResourceFullSerializer,
                               include: INCLUDES
      end

      def create
        @resource = authorize_and_create_zresource(resource_params)
        render_single_resource @resource
      end

      def update
        @resource = load_and_authorize_zresource
        project = @resource.project
        only_meta = !project.updatable_by?(current_user) &&
                    project.resources_manageable_by?(current_user)
        authorized_params = only_meta ? resource_metadata_params : resource_params
        ::Updaters::Resource.new(authorized_params).update(@resource)
        render_single_resource @resource,
                               serializer: ResourceFullSerializer,
                               include: INCLUDES
      end

      def destroy
        @resource = load_and_authorize_zresource
        @resource.destroy
      end

      protected

      def scope_for_zresources
        Resource.friendly
      end

    end
  end
end
