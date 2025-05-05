# frozen_string_literal: true

module API
  module V1
    class AnnotationsController < ApplicationController
      config.pagination_enforced = true

      resourceful! Annotation do
        Annotation.filtered(**with_pagination!(annotation_filter_params))
      end

      def index
        @annotations = load_annotations
        render_multiple_resources(
          @annotations,
          include: [:creator]
        )
      end

      def show
        @annotation = load_annotation
        render_single_resource(
          @annotation,
          include: [:creator, :flags]
        )
      end
    end
  end
end
