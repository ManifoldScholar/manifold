module API
  module V1
    module Me
      module Relationships
        class AnnotatedTextsController < AbstractController
          resourceful! Text do
            current_user.annotated_texts
          end

          def index
            @texts = load_texts

            render_multiple_resources(@texts)
          end
        end
      end
    end
  end
end
