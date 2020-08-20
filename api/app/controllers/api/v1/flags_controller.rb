module API
  module V1
    # Flags controller
    class FlagsController < ApplicationController
      before_action :set_subject

      resourceful! Flag do
        current_user.created_flags
      end

      def create
        @flag = Flag.create(creator: current_user, flaggable: @subject)
        authorize_action_for @flag
        render_single_resource(
          @subject.reload,
          location: nil
        )
      end

      def destroy
        @flag = current_user.created_flags.by_flaggable(@subject).first
        authorize_action_for @flag
        @flag.destroy
        render_single_resource(
          @subject.reload,
          location: nil
        )
      end

      private

      def set_subject
        if params[:annotation_id]
          @subject = Annotation.find(params[:annotation_id])
        elsif params[:comment_id]
          @subject = Comment.find(params[:comment_id])
        end
      end

    end
  end
end
