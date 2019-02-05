module TextSectionJobs
  class EnqueueAdoptAnnotationsJob < ApplicationJob

    def perform(annotations_ids)
      return unless annotations_ids.present?

      Annotation.where(id: annotations_ids).each do |annotation|
        AnnotationJobs::AdoptOrOrphanJob.perform_later annotation
      end
    end
  end
end
