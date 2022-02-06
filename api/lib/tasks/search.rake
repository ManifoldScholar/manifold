module Manifold
  module SearchTask
    def self.types
      %w(
        Annotation
        Event
        Maker
        Project
        Resource
        ResourceCollection
        Subject
        Tag
        Text
        TextSection
        User
        Journal
        JournalIssue
      )
    end

    def self.to_task_name(klass)
      klass.pluralize.underscore.to_sym
    end
  end
end

namespace :manifold do
  namespace :search do
    desc "Reindex searchable models."
    task reindex: :environment do
      Manifold::SearchTask.types.each do |klass|
        msg = "Reindex #{klass}."
        Manifold::Rake.logger.info msg
        klass.constantize.reindex
      end
    end

    namespace :reindex do
      Manifold::SearchTask.types.each do |klass|
        msg = "Reindex #{klass}."
        desc msg
        task Manifold::SearchTask.to_task_name(klass).to_sym => :environment do
          ENV["CLASS"] = klass
          Manifold::Rake.logger.info msg
          klass.constantize.reindex
        end
      end
    end
  end
end
