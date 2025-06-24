# frozen_string_literal: true

module API
  module V1
    module Resources
      module Relationships
        class AnnotationsController < ApplicationController
          before_action :set_resource

          resourceful! Annotation do
            Annotation.filtered(
              **with_pagination!(annotation_filter_params),
              scope: @resource.annotations.with_existing_text.with_read_ability(current_user)
            )
          end

          def index
            @annotations = load_annotations
            render_multiple_resources(@annotations)
          end

          private

          def set_resource
            @resource = Resource.friendly.find(params[:resource_id])
          end
        end
      end
    end
  end
end
