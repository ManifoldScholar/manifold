module API
  module V1
    module ReadingGroups
      module Relationships
        class ReadingGroupMembershipsController < ApplicationController

          before_action :set_reading_group
          authorize_actions_for :reading_group, all_actions: :read

          resourceful! ReadingGroupMembership do
            ReadingGroupMembership.filtered(
              with_pagination!(reading_group_membership_filter_params),
              scope: @reading_group.reading_group_memberships
            )
          end

          def index
            authorize_action_for @reading_group
            @reading_group_memberships = load_reading_group_memberships
            location = api_v1_reading_group_relationships_reading_group_memberships_url(@reading_group.id)
            render_multiple_resources(
              @reading_group_memberships,
              include: [:user],
              location: location
            )
          end

          private

          def location; end

          def set_reading_group
            @reading_group = ReadingGroup.find(params[:reading_group_id])
          end

        end
      end
    end
  end
end
