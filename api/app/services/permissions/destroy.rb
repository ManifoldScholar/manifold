module Permissions
  class Destroy < ActiveInteraction::Base
    object :permission

    # @return [Permission, nil]
    def execute
      @resource = permission.resource_type.constantize.find(permission.resource_id)

      @user = User.find permission.user_id

      @permission = Permission.fetch!(@resource, @user)

      @permission.role_names.each do |role|
        @user.remove_role role, @resource
      end
    end

  end
end
