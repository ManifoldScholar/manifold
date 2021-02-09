module API
  module V1
    module ReadingGroups
      module Relationships
        class ProjectsController < AbstractController
          for_collectable! Project
        end
      end
    end
  end
end
