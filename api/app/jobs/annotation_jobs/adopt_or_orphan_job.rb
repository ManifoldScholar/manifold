# frozen_string_literal: true

module AnnotationJobs
  # @see Annotations::AdoptOrOrphan
  class AdoptOrOrphanJob < ApplicationJob
    queue_as :annotations

    unique_job! by: :job

    # @param [Annotation] annotation
    # @return [void]
    def perform(annotation)
      Annotations::AdoptOrOrphan.run! annotation: annotation
    end
  end
end
