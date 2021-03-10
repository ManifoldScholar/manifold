module API
  module V1
    module Me
      module Relationships
        class ResourceCollectionsController < AbstractController
          for_collectable! ResourceCollection
        end
      end
    end
  end
end
