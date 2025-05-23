# frozen_string_literal: true

module API
  module V1
    module Users
      module Relationships
        class ReadingGroupMembershipsController < ApplicationController
          before_action :set_user, only: [:index]

          resourceful! ReadingGroupMembership do
            @user.reading_group_memberships.filtered(
              **with_pagination!(reading_group_membership_filter_params)
            )
          end

          def index
            @reading_group_memberships = load_reading_group_memberships
            render_multiple_resources(
              @reading_group_memberships,
              include: [:reading_group]
            )
          end

          private

          def set_user
            @user = User.find(params[:user_id])
          end
        end
      end
    end
  end
end
