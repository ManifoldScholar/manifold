module API
  module V1
    module TextSections
      module Relationships
        # Collections controller
        class ResourceCollectionsController < ApplicationController

          before_action :set_text_section, only: [:index]

          resourceful! ResourceCollection, authorize_options: { except: [:index] } do
            @text_section.resource_collections
          end

          def index
            @collections = load_resource_collections
            render_multiple_resources(
              @collections
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
