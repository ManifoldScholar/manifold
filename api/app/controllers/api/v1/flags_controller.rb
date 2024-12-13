# frozen_string_literal: true

module API
  module V1
    class FlagsController < ApplicationController
      before_action :set_flaggable!

      resourceful! Flag do
        current_user.created_flags
      end

      authorize_actions_for ::Flag

      authority_actions resolve_all: "resolve_flags"

      def create
        @flag = current_user.created_flags.where(flaggable: @flaggable).first_or_initialize

        authorize_action_for @flag

        @flag.assign_attributes(flag_params)

        # Allow a user to flag and unflag something without
        # triggering multiple notifications.
        @flag.resolved_by_creator = false

        @flag.save!

        render_single_resource(
          @flaggable.reload,
          serializer: @flaggable_serializer,
          location: nil
        )
      end

      # @see Flag#resolve!
      # @note "Destroying" a flag actually just resolves it to prevent duplicate flags.
      def destroy
        @flag = current_user.created_flags.by_flaggable(@flaggable).first!

        authorize_action_for @flag

        @flag.resolve!(resolver: current_user)

        render_single_resource(
          @flaggable.reload,
          serializer: @flaggable_serializer,
          location: nil
        )
      end

      def resolve_all
        authorize_action_for @flaggable

        @flaggable.resolve_flags!(resolver: current_user)

        render_single_resource(
          @flaggable.reload,
          serializer: @flaggable_serializer,
          location: nil
        )
      end

      private

      # @return [void]
      def set_flaggable!
        if params[:annotation_id]
          @flaggable_serializer = ::V1::AnnotationSerializer
          @flaggable = Annotation.find(params[:annotation_id])
        elsif params[:comment_id]
          @flaggable_serializer = ::V1::CommentSerializer
          @flaggable = Comment.find(params[:comment_id])
        end
      end
    end
  end
end
