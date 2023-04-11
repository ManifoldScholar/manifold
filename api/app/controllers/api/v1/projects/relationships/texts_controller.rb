module API
  module V1
    module Projects
      module Relationships
        class TextsController < AbstractProjectChildController

          resourceful! Text do
            @project.texts
          end

          def create
            @text = ::Updaters::Text.new(text_params, :from_api).update(@project.texts.new, creator: @current_user)
            render_single_resource @text, context: :from_api
          end

        end
      end
    end
  end
end
