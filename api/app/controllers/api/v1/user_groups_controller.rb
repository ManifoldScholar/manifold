# frozen_string_literal: true

module API
  module V1
    class UserGroupsController < ApplicationController
      PRELOADS = %w(memberships entitleables).freeze

      resourceful! UserGroup do
        UserGroup.preload(PRELOADS).filtered(**with_pagination!(user_filter_params))
      end

      def index
        @user_groups = load_user_groups
        render_multiple_resources(@user_groups)
      end

      def show
        @user_group = load_and_authorize_user_group
        render_single_resource @user_group,
                               include: includes
      end

      def create
        @user_group = ::Updaters::UserGroup.new(user_group_params).update(UserGroup.new)
        render_single_resource @user_group,
                               include: includes
      end

      def update
        @user_group = load_and_authorize_user_group
        ::Updaters::UserGroup.new(user_group_params).update(@user_group)
        render_single_resource @user_group,
                               include: includes
      end

      def destroy
        @user_group = load_and_authorize_user_group
        @user_group.destroy
      end

      protected

      def includes
        [:users, :entitlement_subjects]
      end
    end
  end
end
