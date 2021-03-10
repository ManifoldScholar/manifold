module API
  module V1
    module Me
      module Relationships
        class ResourcesController < AbstractController
          for_collectable! Resource
        end
      end
    end
  end
end
