module Api
  module V1
    module Me
      module Relationships
        # Reading groups controller
        class ReadingGroupsController < ApplicationController

          resourceful! ReadingGroup do
            base = current_user.nil? ? ReadingGroup.none : current_user.reading_groups
            base.with_order.page(page_number).per(page_size)
          end

          def index
            @reading_groups = load_reading_groups
            render_multiple_resources @reading_groups, include: ["texts", "reading_group_memberships.user"]
          end

        end
      end
    end
  end
end
