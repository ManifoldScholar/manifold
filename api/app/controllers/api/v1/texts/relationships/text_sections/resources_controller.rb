module API
  module V1
    module Texts
      module Relationships
        module TextSections
          # Resources controller
          class ResourcesController < ApplicationController

            before_action :set_text, only: [:index]
            before_action :set_text_section, only: [:index]

            resourceful! Resource, authorize_options: { except: [:index] } do
              @text_section.resources
            end

            def index
              @resources = load_resources
              render_multiple_resources @resources
            end

            private

            def set_text
              @text = Text.friendly.find(params[:text_id])
            end

            def set_text_section
              @text_section = @text.text_sections.friendly.find(params[:text_section_id])
            end
          end
        end
      end
    end
  end
end
