module AnnotationJobs
  class AdoptOrOrphanJob < ApplicationJob

    def perform(annotation)
      Annotations::AdoptOrOrphan.run annotation: annotation
    end
  end
end
