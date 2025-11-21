# frozen_string_literal: true

module API
  module V1
    module UserGroups
      module Relationships
        class UserGroupMembershipsController < ApplicationController
          before_action :set_group

          resourceful! UserGroupMembership do
            @user_group.user_group_memberships
          end

          def create
            @user_group_membership = ::Updaters::UserGroupMemberships
                                     .new(user_group_membership_params)
                                     .update(UserGroupMembership.new)
            render_single_resource @user_group_membership,
                                   include: [:user]
          end

          def destroy
            @user_group_membership = load_and_authorize_user_group_membership
            @user_group_membership.destroy
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
