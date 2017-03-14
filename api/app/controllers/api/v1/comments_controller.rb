module Api
  module V1
    # Comments controller
    class CommentsController < ApplicationController
      before_action :set_subject
      INCLUDES = %w(creator).freeze

      resourceful! Comment, authorize_options: { except: [:index, :show] } do
        Comment.filter(
          with_pagination!(comment_filter_params),
          scope: @subject.comments
        )
      end

      def index
        @comments = load_comments
        render_multiple_resources(
          @comments,
          include: %w(creator),
          each_serializer: CommentSerializer,
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
          location: comment_location(@comment)
        )
      end

      def update
        @comment = load_and_authorize_comment
        ::Updaters::Default.new(comment_params).update(@comment)
        render_single_resource(
          @comment,
          location: comment_location(@comment)
        )
      end

      # def destroy
      #   @project = load_and_authorize_project
      #   @project.destroy
      # end

      private

      def comment_location(comment)
        if comment.subject_type == "Annotation"
          api_v1_annotation_relationships_comments_path(comment.subject_id, comment)
        elsif comment.subject_type == "Resource"
          api_v1_resource_relationships_comments_path(comment.subject_id, comment)
        end
      end

      def index_location
        if @subject.is_a? Annotation
          api_v1_annotation_relationships_comments_path(@subject)
        elsif @subject.is_a? Resource
          api_v1_resource_relationships_comments_path(@subject)
        end
      end

      def set_subject
        if params[:annotation_id]
          @subject = Annotation.find(params[:annotation_id])
        elsif params[:resource_id]
          @subject = Resource.find(params[:resource_id])
        end
      end

    end
  end
end
