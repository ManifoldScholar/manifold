module Manifold
  module SearchTask
    def self.types
      %w(ResourceCollection Resource Event Maker Project User Subject)
    end
  end
end

namespace :manifold do
  namespace :search do
    desc "Update searchable text nodes."
    task generate_searchable_nodes!: :environment do
      logger = Manifold::Rake.logger
      TextSection.generate_searchable_nodes!(logger)
    end

    desc "Reindex searchable models."
    task reindex: :environment do
      Rake::Task["searchkick:reindex:all"].invoke
    end

    namespace :reindex do
      Manifold::SearchTask.types.each do |class_name|
        desc "Reindex #{class_name.downcase} models."
        task class_name.downcase.to_sym => :environment do
          ENV["CLASS"] = class_name
          Manifold::Rake.logger.info "Reindexing #{ENV['CLASS'].downcase} models."
          Rake::Task["searchkick:reindex"].invoke
        end
      end
    end
  end
end
