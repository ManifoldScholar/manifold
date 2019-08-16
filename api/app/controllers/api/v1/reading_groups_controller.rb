module Api
  module V1
    # Reading groups controller
    class ReadingGroupsController < ApplicationController

      resourceful! ReadingGroup do
        ReadingGroup.all
      end

      def index
        @reading_groups = load_reading_groups
        respond_with_forbidden("reading groups", "list") && return unless ReadingGroup.listable_by?(current_user)
        render_multiple_resources @reading_groups
      end

      def show
        @reading_group = load_and_authorize_reading_group
        render_single_resource @reading_group,
                               serializer: ReadingGroupSerializer
      end

      def create
        @reading_group = authorize_and_create_reading_group(reading_group_params)
        render_single_resource @reading_group
      end

      def update
        @reading_group = load_and_authorize_reading_group
        ::Updaters::ReadingGroup.new(reading_group_params).update(@reading_group)
        render_single_resource @reading_group,
                               serializer: ReadingGroupSerializer
      end

      def destroy
        @reading_group = load_and_authorize_reading_group
        @reading_group.destroy
      end

    end
  end
end
