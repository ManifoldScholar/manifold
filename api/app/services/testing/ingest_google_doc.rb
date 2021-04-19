module Testing
  class IngestGoogleDoc < ActiveInteraction::Base
    record :project

    string :source_url

    validates :source_url, url: true

    def execute
      @ingestion = Ingestion.new project: project, creator: User.cli_user, external_source_url: source_url

      @ingestion.save!

      @logger = Logger.new(STDOUT)

      compose Ingestions::Ingestor, ingestion: @ingestion, logger: @logger
    end
  end
end
