module API
  module V1
    module Users
      module Relationships
        class AnnotationsController < ApplicationController
          before_action :set_user, only: [:index]

          resourceful! Annotation do
            scope = Annotation.created_by(@user).sans_archived_reading_group_memberships.sans_orphaned_from_text

            Annotation.filtered(
              with_pagination!(annotation_filter_params),
              scope: scope
            )
          end

          def index
            @annotations = load_annotations
            render_multiple_resources(
              @annotations
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