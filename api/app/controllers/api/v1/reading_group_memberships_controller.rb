module Api
  module V1
    # Reading group memberships controller
    class ReadingGroupMembershipsController < ApplicationController

      before_action :authenticate_request!

      resourceful! ReadingGroupMembership do
        ReadingGroupMembership.all
      end

      def create
        @reading_group_membership = ::Updaters::Default
          .new(reading_group_membership_params)
          .update_without_save(ReadingGroupMembership.new)
        authorize_action_for @reading_group_membership
        @reading_group_membership.save
        render_single_resource @reading_group_membership
      end

      def destroy
        @reading_group_membership = load_and_authorize_reading_group_membership
        @reading_group_membership.destroy
      end

    end
  end
end
