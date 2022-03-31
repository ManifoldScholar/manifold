module API
  module V1
    module Me
      module Relationships
        class JournalIssuesController < AbstractController
          for_collectable! JournalIssue
        end
      end
    end
  end
end
