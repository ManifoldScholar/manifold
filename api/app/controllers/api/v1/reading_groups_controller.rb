require "uuid"

module Api
  module V1
    # Reading groups controller
    class ReadingGroupsController < ApplicationController

      before_action :authenticate_request!

      resourceful! ReadingGroup do
        ReadingGroup.all
      end

      def index
        @reading_groups = load_reading_groups
        respond_with_forbidden("reading groups", "list") && return unless ReadingGroup.listable_by?(current_user)

        render_multiple_resources @reading_groups
      end

      def show
        @reading_group = uuid? ? load_and_authorize_reading_group : lookup_reading_group
        render_single_resource @reading_group,
                               include: ["texts", "reading_group_memberships.user"]
      end

      def create
        @reading_group = authorize_and_create_reading_group(reading_group_params)
        render_single_resource @reading_group
      end

      def update
        @reading_group = load_and_authorize_reading_group
        ::Updaters::ReadingGroup.new(reading_group_params).update(@reading_group)
        render_single_resource @reading_group
      end

      def destroy
        @reading_group = load_and_authorize_reading_group
        @reading_group.destroy
      end

      private

      def uuid?
        UUID.validate(params[:id])
      end

      def lookup_reading_group
        rg = ReadingGroup.by_invitation_code(params[:id])
        raise ActiveRecord::RecordNotFound unless rg

        rg
      end

    end
  end
end
