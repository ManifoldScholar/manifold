# The <tt>Ingestor</tt> module is the main entry point into text ingestion.
# Ingestor::ingest(path) will ingest the document or directory at _path_, which
# involves parsing the document's structure, copying resources, updating
# internal linkages, and storing all the document content in the Manifold-API
# database.
#
# All of the heavy lifting of the Ingestion process is outsourced to strategies.
# Strategies are responsible for looking at the document being ingested,
# determining whether they are equipped to ingest it, and ultimately breaking it
# down into its constituent parts. The public API for ingesetion should, then,
# be very simple, consisting primarily of the _ingest_ method.
#
# @author Zach Davis
module Ingestor
  class << self
    attr_writer :logger

    # Ingests a single subject (file or directory) into Manifold
    #
    # @author Zach Davis
    # @param [String] path The relative or absolute path to the ingestion
    #   subject
    # @return [Text] the text that is created or updated through the ingestion
    # @raise [IngestionFailed] Strategies can trigger an ingestion failure by
    #   raising an IngestionFailed exception, which will be caught and logged by
    #   the ingestor.
    def ingest(path)
      basename, ingestion, strategy = start(path)
      validate_strategy(strategy)
      set_ingestion_text(strategy, ingestion)
      strategy.ingest(ingestion)
      logger.info I18n.t("services.ingestor.logging.ingestion_end",
                         name: basename)
      return ingestion.text
    rescue Ingestor::IngestionFailed => e
      logger.error(e.message)
    end

    # Resets the ingestion logger to Rails.logger
    #
    # @author Zach Davis
    # @return [Logger] the ingestor's current logger
    def reset_logger
      @logger = Rails.logger
    end

    def logger
      @logger || Rails.logger
    end

    private

    # @private
    # @return [Array] Array with [basename, ingestion, strategy]
    def start(path)
      unless File.exist?(path)
        fail Ingestor::IngestionFailed,
             "Could not find ingestion source"
      end
      basename = File.basename(path)
      @logger.info I18n.t("services.ingestor.logging.ingestion_start",
                          name: basename)
      ingestion = Ingestor::Ingestion.new(path)
      strategy = Ingestor::Strategy.for(ingestion)
      @logger.info I18n.t("services.ingestor.logging.using_strategy",
                          strategy: strategy)
      [basename, ingestion, strategy]
    end

    def validate_strategy(strategy)
      return unless strategy.nil?
      fail IngestionFailed,
           I18n.t("services.ingestor.failures.strategy_not_found")
    end

    def set_ingestion_text(strategy, ingestion)
      id = strategy.unique_id(ingestion)
      @logger.info I18n.t("services.ingestor.logging.text_found", id: id)
      text = Text.where(unique_identifier: id).first
      ingestion.text = text if text
    end
  end
end
