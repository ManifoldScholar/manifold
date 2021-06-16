module API
  module V1
    module Me
      module Relationships
        # Reading groups controller
        class ReadingGroupsController < ApplicationController

          SERIALIZED_INCLUDES = %i[collection annotated_texts reading_group_memberships.user].freeze

          resourceful! ReadingGroup do
            base = current_user.nil? ? ReadingGroup.none : current_user.reading_groups
            base.page(page_number).per(page_size).for_serialization.filtered(with_pagination!(reading_group_filter_params))
          end

          def index
            @reading_groups = load_reading_groups
            render_multiple_resources @reading_groups, include: SERIALIZED_INCLUDES, calculate_all_abilities: true
          end
        end
      end
    end
  end
end
