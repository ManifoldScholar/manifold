# frozen_string_literal: true

module API
  module V1
    module ResourceCollections
      module Relationships
        class AnnotationsController < ApplicationController
          before_action :set_collection

          resourceful! Annotation do
            Annotation.filtered(
              **with_pagination!(annotation_filter_params),
              scope: @collection.annotations.with_existing_text.with_read_ability(current_user)
            )
          end

          def index
            @annotations = load_annotations
            render_multiple_resources(@annotations)
          end

          private

          def set_collection
            @collection = ResourceCollection.friendly.find(params[:resource_collection_id])
          end
        end
      end
    end
  end
end
