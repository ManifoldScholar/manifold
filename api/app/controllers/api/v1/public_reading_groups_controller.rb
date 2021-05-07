module API
  module V1
    class PublicReadingGroupsController < ApplicationController
      SERIALIZED_INCLUDES = %i[kind collection].freeze
      EAGER_LOADS = [
        :reading_group_collection, :reading_group_kind,
        { reading_group_memberships: %i[user] }
      ].freeze

      resourceful! ReadingGroup, authorize_options: { except: [:index, :show] } do
        ReadingGroup.includes(*EAGER_LOADS).visible_to_public.filtered(filter_options)
      end

      def index
        @reading_groups = load_reading_groups

        render_multiple_resources @reading_groups, include: SERIALIZED_INCLUDES
      end

      private

      def filter_options
        with_pagination!({})
      end
    end
  end
end
