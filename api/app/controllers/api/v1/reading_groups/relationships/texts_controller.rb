module API
  module V1
    module ReadingGroups
      module Relationships
        class TextsController < AbstractController
          for_collectable! Text
        end
      end
    end
  end
end
