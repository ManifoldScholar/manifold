module API
  module V1
    # Sections controller
    class TextSectionsController < ApplicationController

      resourceful! TextSection, authorize_options: { except: [:index, :show] }

      record_analytics_for!(TextSection) do
        record_analytics_for_action :show, event: :view
      end

      def show
        @text_section = load_text_section
        authorize_action_for @text_section.text
        includes = %w(stylesheets)
        render_single_resource @text_section,
                               include: includes
      end

    end
  end
end
