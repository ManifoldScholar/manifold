# frozen_string_literal: true

module API
  module V1
    module UserGroups
      module Relationships
        class UserGroupEntitleablesController < ApplicationController
          before_action :set_group

          resourceful! UserGroupEntitleable do
            @user_group.user_group_entitleables
          end

          def create
            @user_group_entitleable = ::Updaters::UserGroupEntitelables
                                     .new(user_group_entitleable_params)
                                     .update(UserGroupEntitleable.new)
            render_single_resource @user_group_entitleable,
                                   include: [:user]
          end

          def destroy
            @user_group_entitleable = load_and_authorize_user_group_entitleable
            @user_group_entitleable.destroy
          end

          protected

          def set_group
            @user_group = UserGroup.find(params[:user_group_id])
          end
        end
      end
    end
  end
end
