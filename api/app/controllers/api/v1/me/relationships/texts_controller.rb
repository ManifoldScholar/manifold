module API
  module V1
    module Me
      module Relationships
        class TextsController < AbstractController
          for_collectable! Text
        end
      end
    end
  end
end
