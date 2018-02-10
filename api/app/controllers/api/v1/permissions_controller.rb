module Api
  module V1
    class PermissionsController < ApplicationController

      INCLUDES = %w(user).freeze

      resourceful! Permission

      def index
        render json: permissions_scope.all
      end

      def show
        permission = load_and_authorize_permission
        render json: permission
      end

      def create
        permission = ::Updaters::Default.new(permission_params)
                                        .update_without_save(permissions_scope.new)
        outcome = Permissions::Save.run permission: permission
        render_single_resource outcome.result,
                               location: location(outcome.result),
                               include: INCLUDES
      end

      def update
        permission = load_and_authorize_permission
        permission = ::Updaters::Default.new(permission_params)
                                        .update_without_save(permission)
        outcome = Permissions::Save.run permission: permission
        render_single_resource outcome.result,
                               location: location(outcome.result),
                               include: INCLUDES
      end

      def destroy
        permission = load_and_authorize_permission
        Permissions::Destroy.run permission: permission
      end

      private

      # @return [#permissions]
      def parent_resource
        @parent_resource ||= find_parent_resource
      end

      # Include conditional for every resource type added
      # rubocop:disable Style/GuardClause
      def find_parent_resource
        if params.key?(:project_id)
          Project.friendly.find params[:project_id]
        else
          raise "cannot derive parent resource for permissions"
        end
      end
      # rubocop:enable Style/GuardClause

      # @return [ActiveRecord::Relation<Permission>
      def permissions_scope
        Permission.by_resource(parent_resource)
      end

      def location(permission)
        kind = permission.resource_type.downcase
        __send__("api_v1_#{kind}_relationships_permissions_url",
                 permission,
                 "#{kind}_id": permission.resource_id)
      end
    end
  end
end
