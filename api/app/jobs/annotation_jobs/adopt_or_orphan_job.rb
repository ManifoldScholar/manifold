# frozen_string_literal: true

module AnnotationJobs
  # @see Annotations::AdoptOrOrphan
  class AdoptOrOrphanJob < ApplicationJob
    queue_as :annotations

    unique :until_executed, lock_ttl: 15.minutes, on_conflict: :log

    # @param [Annotation] annotation
    # @return [void]
    def perform(annotation)
      Annotations::AdoptOrOrphan.run! annotation: annotation
    end
  end
end
