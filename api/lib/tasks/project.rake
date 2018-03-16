# rubocop:disable Metrics/BlockLength
module Manifold
  module ProjectTask
    # rubocop:disable Metrics/AbcSize
    def ingest(path, log_level, text_id = nil)
      path ||= raise I18n.t("rake.ingest.errors.missing_path")
      log_level ||= "info"
      Ingestor.logger = Manifold::Rake.logger
      Ingestor.logger.level = Logger.const_get(log_level.upcase.to_sym)
      text = text_id ? Text.find(text_id) : nil
      if text_id && text
        Ingestor.ingest_update(path, Manifold::Rake.cli_user, text)
      else
        Ingestor.ingest(path, Manifold::Rake.cli_user)
      end
      Ingestor.reset_logger
    end
  end
  # rubocop:enable Metrics/AbcSize
end

namespace :manifold do
  namespace :project do
    desc "Fetch the project's tweets"
    task :fetch_tweets, [:project_id] => :environment do |_t, args|
      ::FetchProjectTweets.perform_now(args[:project_id])
      Manifold::Rake.logger.info "Tweets fetched for #{args[:project_id]}"
    end

    desc "Ingest a project text"
    task :ingest, [:project_id, :path] => :environment do |_t, args|
      Manifold::Rake.logger.info "Ingesting #{args[:path]}"
      Ingestor.logger = Logger.new(STDOUT)
      cli_user = User.find_by(is_cli_user: true)
      text = Ingestor.ingest(args[:path], cli_user)
      Ingestor.reset_logger
      project = Project.find(args[:project_id])
      text.project = project
      text.save
      Manifold::Rake.logger.info "Ingested text: #{text.id}"
    end

    desc "Reingest a project text"
    task :reingest, [:project_id, :text_id, :path] => :environment do |_t, args|
      Manifold::Rake.logger.info "Reingesting #{args[:path]} for #{arg[:text_id]}"
      Manifold::IngestTask.ingest(args[:path], "debug", args[:text_id])
    end

    desc "Import a project form a JSON definition"
    task :import, [:path, :include_texts] => :environment do |_t, args|
      cli_user = Manifold::Rake.cli_user
      include_texts = args[:include_texts] == "no" ? false : true
      Manifold::Rake.logger.info "Importing project from #{args[:path]}"
      Importer::Project.new(
        args[:path],
        cli_user,
        Manifold::Rake.logger
      ).import(include_texts)
    end

    namespace :import do
      namespace :drive do
        desc "Imports a projects resource into Manifold from Google Drive"
        task :resources,
             [:project_id, :drive_sheet, :drive_dir] => :environment do |_t, args|
          cli_user = Manifold::Rake.cli_user
          Manifold::Rake.logger.info "Importing drive resource for #{args[:project_id]}"
          importer = Importer::DriveResources.new(args[:project_id], args[:drive_sheet],
                                                  args[:drive_dir], cli_user,
                                                  Manifold::Rake.logger)
          importer.import
        end
      end
    end
  end
end
# rubocop:enable Metrics/BlockLength
