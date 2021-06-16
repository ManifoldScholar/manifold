module API
  module V1
    module Me
      module Relationships
        class ProjectsController < AbstractController
          for_collectable! Project
        end
      end
    end
  end
end
