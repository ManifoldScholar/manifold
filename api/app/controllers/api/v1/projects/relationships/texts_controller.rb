module API
  module V1
    module Projects
      module Relationships
        class TextsController < AbstractProjectChildController

          resourceful! Text do
            @project.texts
          end

          def create
            @text = authorize_and_create_text(text_params)
            render_single_resource @text
          end

        end
      end
    end
  end
end
