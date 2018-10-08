module Api
  module V1
    module TextSections
      module Relationships
        # Resources controller
        class ResourcesController < ApplicationController

          before_action :set_text_section, only: [:index]

          INCLUDES = %w().freeze

          resourceful! Resource, authorize_options: { except: [:index] } do
            @text_section.resources
          end

          def index
            @resources = load_resources
            render_multiple_resources @resources
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
