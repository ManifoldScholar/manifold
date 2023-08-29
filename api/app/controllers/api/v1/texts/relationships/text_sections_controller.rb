module API
  module V1
    module Texts
      module Relationships
        class TextSectionsController < ApplicationController
          before_action :set_text, only: [:index, :create, :show]

          resourceful! TextSection, authorize_options: { except: [:index, :show] } do
            @text.text_sections
          end

          def index
            @text_sections = load_text_sections
            location = api_v1_text_relationships_text_sections_url(@text)

            render_multiple_resources(
              @text_sections,
              location: location
            )
          end

          def show
            @text_section = @text.text_sections.friendly.find(params[:id])
            authorize_action_for @text_section.text
            includes = %w(stylesheets)
            render_single_resource @text_section,
                                   include: includes
          end

          def create
            @text_section = ::Updaters::Text.new(text_section_params, :from_api).update(@text.text_sections.new, creator: @current_user)
            render_single_resource @text_section, context: :from_api
          end

          private

          def set_text
            @text = Text.friendly.find(params[:text_id])
          end
        end
      end
    end
  end
end
