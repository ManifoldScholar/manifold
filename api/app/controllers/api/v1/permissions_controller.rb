module API
  module V1
    class PermissionsController < ApplicationController

      resourceful! Permission, authorize_options: {
        except: [:index, :create, :show, :update, :destroy]
      }

      def index
        authorize_action_for Permission, for: parent_resource
        render_multiple_resources permissions_scope.all, include: includes
      end

      def show
        permission = load_permission
        authorize_action_for permission
        render_single_resource permission
      end

      def create
        permission = ::Updaters::Default.new(permission_params)
          .update_without_save(permissions_scope.new)
        authorize_action_for permission
        outcome = Permissions::Save.run permission: permission
        render_single_resource outcome.result,
                               location: location(outcome.result),
                               include: includes
      end

      def update
        permission = load_permission
        authorize_action_for permission
        permission = ::Updaters::Default.new(permission_params)
          .update_without_save(permission)
        outcome = Permissions::Save.run permission: permission
        render_single_resource outcome.result,
                               location: location(outcome.result),
                               include: includes
      end

      def destroy
        permission = load_permission
        authorize_action_for permission
        Permissions::Destroy.run permission: permission
      end

      private

      def includes
        [:user]
      end

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
