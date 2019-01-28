module Manifold
  module ThumbnailsTask
    def self.types
      %w(Maker ResourceCollection Resource Project User)
    end
  end
end

namespace :manifold do
  namespace :thumbnails do
    desc "Regenerate all Manifold thumbnails."
    task regenerate: :environment do
      Manifold::ThumbnailsTask.types.each do |class_name|
        Rake::Task["manifold:thumbnails:regenerate:#{class_name.downcase}"].invoke
      end
    end

    namespace :regenerate do
      Manifold::ThumbnailsTask.types.each do |class_name|
        desc "Regenerate Manifold #{class_name.downcase} thumbnails."
        task class_name.downcase.to_sym => :environment do
          ENV["CLASS"] = class_name
          Manifold::Rake.logger.info "Regenerating #{ENV['CLASS'].downcase} thumbnails."
          Rake::Task["paperclip:refresh"].invoke
        end
      end
    end
  end
end
