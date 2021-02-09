module API
  module V1
    module ReadingGroups
      module Relationships
        class ResourcesController < AbstractController
          for_collectable! Resource
        end
      end
    end
  end
end
