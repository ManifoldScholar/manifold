# rubocop:disable Metrics/BlockLength
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
      cli_user = User.cli_user
      project = Project.find(args[:project_id])
      ingestion = Ingestion.create(source: File.open(args[:path]),
                                   creator: cli_user,
                                   project: project)
      outcome = Ingestions::Ingestor.run ingestion: ingestion,
                                         logger: Logger.new(STDOUT)
      if outcome.valid?
        Manifold::Rake.logger.info "Ingested text: #{outcome.result.id}"
      else
        Manifold::Rake.logger.info "Could not ingest #{args[:path]}"
      end
    end

    desc "Import a project form a JSON definition"
    task :import, [:path, :include_texts] => :environment do |_t, args|
      cli_user = Manifold::Rake.cli_user
      include_texts = args[:include_texts] != "no"
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
