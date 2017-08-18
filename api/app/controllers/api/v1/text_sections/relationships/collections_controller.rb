module Api
  module V1
    module TextSections
      module Relationships
        # Collections controller
        class CollectionsController < ApplicationController

          before_action :set_text_section, only: [:index]

          INCLUDES = %w().freeze

          resourceful! Collection, authorize_options: { except: [:index] } do
            @text_section.collections
          end

          def index
            @resources = load_resources
            render_multiple_resources(
              @resources,
              each_serializer: CollectionSerializer
            )
          end

          private

          def set_text_section
            @text_section = TextSection.find(params[:text_section_id])
          end

        end
      end
    end
  end
end
