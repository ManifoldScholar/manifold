require "pathname"

namespace :manifold do
  # rubocop:disable Metrics/BlockLength
  namespace :import do
    desc "Imports all projects in a directory into Manifold"
    task :projects, [:path, :include_texts, :log_level] => :environment do |_t, args|
      include_texts = args[:include_texts] == "no" ? false : true
      children = Pathname.new(args[:path]).children.select(&:directory?)
      logger = Manifold::Rake.logger
      user = Manifold::Rake.cli_user
      children.each do |child|
        next if File.file?(File.join(child, ".skip"))
        Importer::Project.new(child, user, logger).import(include_texts)
      end
    end
  end
  # rubocop:enable Metrics/BlockLength
end
