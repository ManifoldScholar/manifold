module Ingestor
  class << self

    def ingest(path)
      begin
        basename = File.basename(path)
        @logger.info("Ingesting #{basename}")
        ingestion = Ingestor::Ingestion.new(path)
        strategy = Strategy.for(ingestion)
        raise IngestionFailed, 'Could not find strategy' if strategy .nil?
        id = strategy.unique_id(ingestion)
        @logger.info("Found ID: #{id}")
        text = Text.where(:unique_identifier => id).first
        if text
          ingestion.text = text
        end
        @logger.info("Using strategy #{strategy }")
        strategy.ingest(ingestion)
        @logger.info("#{basename} ingested!")
      rescue IngestionFailed => e
        @logger.error(e.message)
      end
    end

    def logger=(logger)
      @logger = logger
    end

    def reset_logger()
      @logger = Rails.logger
    end

    def logger
      @logger || Rails.logger
    end

  end
end