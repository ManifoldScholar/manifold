require "json"

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
      project = Project.find(args[:project_id])
      ingestion = Ingestions::CreateManually.run(project: project,
                                                 source: File.open(args[:path]),
                                                 creator: User.cli_user).result
      outcome = Ingestions::Ingestor.run ingestion: ingestion,
                                         logger: Logger.new($stdout)
      if outcome.valid?
        Manifold::Rake.logger.info "Ingested text: #{outcome.result.id}"
      else
        Manifold::Rake.logger.info "Could not ingest #{args[:path]}"
      end
    end

    desc "Bulk ingest texts into a project"
    task :bulk_ingest, [:project_id, :path] => :environment do |_t, args|
      # Lookup the project by provided ID
      project = Project.find(args[:project_id])
      Manifold::Rake.logger.error("Project not found. Exiting.") unless project.present?
      # Exit if the project cannot be found.
      exit unless project.present?

      # Loop through each child directory of the provided path.
      paths = Pathname.new(args[:path]).children.select(&:directory?)

      paths.each do |base_path|
        key = File.basename(base_path)
        metadata_path = "#{base_path}/#{key}.json"
        ingest_path = "#{base_path}/#{key}.zip"
        # Proceed to the next directory if this directory doesn't contain a json file and a zip file
        # with the same name as the directory.
        next unless File.file?(metadata_path) && File.file?(ingest_path)

        # Look for an existing text on the project that was ingested from a file with the same name.
        # If found, update that text. Otherwise, create a new text.
        Manifold::Rake.logger.info "Ingesting #{ingest_path}"
        existing_text_id = project.ingestions.where("source_data->'metadata'->>'filename' = '#{key}.zip'")
          .order(created_at: :desc)
          .pluck(:text_id)
          .compact.first
        existing_text = existing_text_id ? Text.find(existing_text_id) : nil
        Manifold::Rake.logger.info "Updating existing text #{existing_text_id}" if existing_text

        # Setup the ingestion record and run the ingestion./
        ingestion = Ingestion.create(source: File.open(ingest_path), text: existing_text, project: project, creator: User.cli_user)
        outcome = Ingestions::Ingestor.run ingestion: ingestion,
                                           logger: Logger.new($stdout)
        if outcome.valid?
          # Log which text was updated.
          touched_text = outcome.result
          Manifold::Rake.logger.info "Ingested text: #{touched_text.title} [#{touched_text.id}]"

          # If the ingestion succeeded, parse the json file and apply the metadata update.
          touched_text = existing_text # Remove this.
          Manifold::Rake.logger.info("Updating text from JSON data: #{touched_text.title}")
          text_data = JSON.parse(File.read(metadata_path))
          # Cast all metadata to strings.
          touched_text.metadata = text_data["data"].transform_values { |v| v.to_s; }
          # Set the slug if present.
          touched_text.pending_slug = text_data["slug"].to_s if text_data["slug"].present?
          if touched_text.valid?
            Manifold::Rake.logger.info("Text is valid. Saving.")
            touched_text.save
          else
            # Test is invalid. Output errors and proceed.
            Manifold::Rake.logger.error("Text is invalid. Cannot save.")
            Manifold::Rake.logger.error(touched_text.errors.full_messages)
          end
        else
          Manifold::Rake.logger.info "Could not ingest #{args[:path]}"
        end
      end
    end

    desc "Ingest a project text from a URL"
    task :ingest_url, [:project_id, :url] => :environment do |_t, args|
      Manifold::Rake.logger.info "Ingesting #{args[:path]}"
      project = Project.find(args[:project_id])
      ingestion = Ingestions::CreateManually.run(project: project,
                                                 url: args[:url],
                                                 creator: User.cli_user).result
      outcome = Ingestions::Ingestor.run ingestion: ingestion,
                                         logger: Logger.new($stdout)
      if outcome.valid?
        Manifold::Rake.logger.info "Ingested text: #{outcome.result.id}"
      else
        Manifold::Rake.logger.info "Could not ingest #{args[:path]}"
      end
    end

    desc "Import a project from a JSON definition"
    task :import, [:path, :include_texts] => :environment do |_t, args|
      cli_user = Manifold::Rake.cli_user
      include_texts = args[:include_texts] != "no"
      Manifold::Rake.logger.info "Importing project from #{args[:path]}"
      Importer::Project.new(
        args[:path],
        cli_user,
        Manifold::Rake.logger
      ).import(include_texts: include_texts)
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
