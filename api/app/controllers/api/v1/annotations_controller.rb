module API
  module V1
    class AnnotationsController < ApplicationController
      config.pagination_enforced = true

      resourceful! Annotation do
        Annotation.includes(:creator)
          .filtered(with_pagination!(annotation_filter_params))
      end

      def index
        @annotations = load_annotations
        render_multiple_resources(
          @annotations,
          include: [:creator]
        )
      end
    end
  end
end
