module API
  module V1
    module Users
      module Relationships
        class ReadingGroupsController < ApplicationController
          before_action :set_user, only: [:index]

          resourceful! ReadingGroup do
            @user.reading_groups.filtered(
              with_pagination!(reading_group_filter_params)
            )
          end

          def index
            @reading_groups = load_reading_groups
            render_multiple_resources(
              @reading_groups
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
