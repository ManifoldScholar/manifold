module API
  module V1
    module ReadingGroups
      module Relationships
        class ResourceCollectionsController < AbstractController
          for_collectable! ResourceCollection
        end
      end
    end
  end
end
