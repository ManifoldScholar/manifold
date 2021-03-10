module API
  module V1
    module Me
      module Relationships
        class TextSectionsController < AbstractController
          for_collectable! TextSection
        end
      end
    end
  end
end
