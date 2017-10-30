module Subjects
  class PruneUnassociatedJob < ApplicationJob
    def perform
      Subject.unassociated.created_more_than(5.minutes.ago).destroy_all
    end
  end
end
