# frozen_string_literal: true

module Projects
  class ReindexChildrenJob < ApplicationJob
    queue_as :low_priority

    # @param [Project] project
    # @return [void]
    def perform(project)
      Projects::ReindexResourcesJob.perform_later project
      Projects::ReindexTextsJob.perform_later project
      Projects::ReindexTextSectionsJob.perform_later project
    end
  end
end
