require "pathname"

namespace :manifold do
  namespace :import do
    desc "Imports all projects in a directory into Manifold"
    task :projects, [:path, :include_texts, :log_level] => :environment do |_t, args|
      include_texts = args[:include_texts] != "no"
      children = Pathname.new(args[:path]).children.select(&:directory?)
      logger = Manifold::Rake.logger
      user = Manifold::Rake.cli_user
      children.each do |child|
        next if File.file?(File.join(child, ".skip"))

        Importer::Project.new(child, user, logger).import(include_texts: include_texts)
      end
    end

    desc "Imports all texts in a directory into Manifold and creates a project for each text"
    task :texts, [:path] => :environment do |_t, args|
      children = Pathname.new(args[:path]).children.select { |p| p.extname.downcase == ".epub" }
      logger = Manifold::Rake.logger
      user = Manifold::Rake.cli_user
      children.each do |text_path|
        ApplicationRecord.transaction do
          project = Project.create(title: "text-import-project-placeholder", creator: user, draft: false)
          logger.info("Created project #{project.id}")
          ingestion = Ingestions::CreateManually.run(project: project,
                                                     source: File.open(text_path),
                                                     creator: user).result
          logger.info "  Importing project text at #{text_path}"
          outcome = Ingestions::Ingestor.run ingestion: ingestion,
                                             logger: logger
          text = outcome.result if outcome.valid?
          if text.present?
            logger.info "Created #{'published ' if text.published?}text #{text.title}"
            logger.info("Updating project title and slug")
            project.title = text.title
            project.pending_slug = text.title
            project.save
            logger.info "  Creating project content blocks"
            Content::ScaffoldProjectContent.run project: project,
                                                kind: "one_text"
            ContentBlockReference.create(
              content_block: project.content_blocks.first,
              referencable: project.texts.first, kind: "text"
            )
          else
            logger.error "Unable to import project text at #{text_path}"
          end
        end
      end
    end
  end
end
