module API
  module V1
    # Comments controller
    class CommentsController < ApplicationController
      before_action :set_subject

      resourceful! Comment, authorize_options: { except: [:index, :show] } do
        Comment.filtered(
          with_pagination!(comment_filter_params),
          scope: comment_scope.roots_and_descendants_preordered
        )
      end

      record_analytics_for! Comment do
        record_analytics_for_action :create, event: :create_resource
      end

      def index
        @comments = load_comments
        render_multiple_resources(
          @comments,
          include: includes,
          location: index_location
        )
      end

      def show
        @comment = load_comment
        render_single_resource(
          @comment,
          location: comment_location(@comment)
        )
      end

      def create
        @comment = authorize_and_create_comment(comment_params)
        render_single_resource(
          @comment,
          location: comment_location(@comment),
          include: includes
        )
      end

      def update
        @comment = load_and_authorize_comment
        ::Updaters::Default.new(comment_params(@comment)).update(@comment)
        render_single_resource(
          @comment,
          location: comment_location(@comment)
        )
      end

      def destroy
        @comment = load_and_authorize_comment
        @comment.destroy
      end

      private

      def includes
        [:creator]
      end

      def comment_location(comment)
        case comment.subject_type
        when "Annotation"
          api_v1_annotation_relationships_comments_path(comment.subject_id, comment)
        when "Resource"
          api_v1_resource_relationships_comments_path(comment.subject_id, comment)
        end
      end

      def index_location
        case @subject
        when Annotation
          api_v1_annotation_relationships_comments_path(@subject)
        when Resource
          api_v1_resource_relationships_comments_path(@subject)
        end
      end

      def comment_scope
        @subject.nil? ? Comment.all : @subject.comments
      end

      def set_subject
        if params[:annotation_id]
          @subject = Annotation.find(params[:annotation_id])
        elsif params[:resource_id]
          @subject = Resource.friendly.find(params[:resource_id])
        end
      end

    end
  end
end
