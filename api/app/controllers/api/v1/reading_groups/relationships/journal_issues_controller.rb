# frozen_string_literal: true

module API
  module V1
    module ReadingGroups
      module Relationships
        class JournalIssuesController < AbstractController
          for_collectable! JournalIssue
          include_scopes! :journal
        end
      end
    end
  end
end
