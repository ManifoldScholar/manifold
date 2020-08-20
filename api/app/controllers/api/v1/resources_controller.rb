module API
  module V1
    # resources controller
    class ResourcesController < ApplicationController

      resourceful! Resource, authorize_options: { except: [:index, :show] } do
        Resource.filtered(with_pagination!(resource_filter_params))
      end

      def index
        @resources = load_zresources
        render_multiple_resources @resources
      end

      def show
        @resource = load_zresource
        authorize_action_for @resource
        render_single_resource @resource,
                               include: includes
      end

      def update
        @resource = load_and_authorize_zresource
        project = @resource.project
        only_meta = !project.updatable_by?(current_user) &&
                    project.resources_manageable_by?(current_user)
        authorized_params = only_meta ? resource_metadata_params : resource_params
        ::Updaters::Resource.new(authorized_params).update(@resource)
        render_single_resource @resource,
                               include: includes
      end

      def destroy
        @resource = load_and_authorize_zresource
        @resource.destroy
      end

      protected

      def includes
        [:project]
      end

      def scope_for_zresources
        Resource.friendly
      end

    end
  end
end
