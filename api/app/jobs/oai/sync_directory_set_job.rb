# frozen_string_literal: true

module OAI
  class SyncDirectorySetJob < ApplicationJob
    queue_as :default

    def perform
      return unless Settings.instance.oai.directory_enabled?

      directory_set = ManifoldOAISet.fetch_directory!
      return unless directory_set.present?

      # Sync projects
      Project.where(journal_issue_id: nil)
             .joins(:manifold_oai_record)
             .find_each do |project|
        directory_set.link! project.manifold_oai_record
      end

      # Sync journals
      Journal.joins(:manifold_oai_record)
             .find_each do |journal|
        directory_set.link! journal.manifold_oai_record
      end
    end
  end
end
