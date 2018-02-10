module Permissions
  class Save < ActiveInteraction::Base
    object :permission

    # @return [Permission, nil]
    # rubocop:disable Metrics/AbcSize
    def execute
      return permission unless permission.valid?

      @resource = permission.resource_type.constantize.find(permission.resource_id)

      @user = User.find permission.user_id

      existing_roles = Permission.fetch_roles_for(@resource, @user)

      roles_to_keep, roles_to_remove = existing_roles.partition do |name|
        name.in? permission.role_names
      end

      roles_to_add = permission.role_names - roles_to_keep

      roles_to_add.each do |role|
        @user.add_role role, @resource
      end

      roles_to_remove.each do |role|
        @user.remove_role role, @resource
      end

      Permission.fetch!(@resource, @user) if permission.role_names.present?
    end
    # rubocop:enable Metrics/AbcSize

  end
end
