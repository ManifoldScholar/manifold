module API
  module V1
    class PublicReadingGroupsController < ApplicationController
      resourceful! ReadingGroup, authorize_options: { except: [:index, :show] } do
        ReadingGroup.visible_to_public
      end

      def index
        @reading_groups = load_reading_groups

        render_multiple_resources @reading_groups
      end
    end
  end
end
