module API
  module V1
    class UserGroupsController < ApplicationController
      PRELOADS = %w(memberships entitlements).freeze

      resourceful! UserGroup do
        UserGroup.preload(PRELOADS).filtered(**with_pagination!(user_filter_params))
      end

      def index
        @user_groups = load_user_groups
        render_multiple_resources(@user_groups)
      end

      def show
        @user_group = load_and_authorize_user_group
        render_single_resource @user_group
      end

      def create
        @user_group = ::Updaters::UserGroup.new(user_group_params).update(UserGroup.new)
        render_single_resource @user_group
      end

      def update
        @user_group = load_and_authorize_user_group
        ::Updaters::UserGroup.new(user_group_params).update(@user_group)
        render_single_resource @user_group
      end

      def destroy
        @user_group = load_and_authorize_user_group
        @user_group.destroy
      end
    end
  end
end
