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
    include Ingestor::Loggable

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
    def ingest(path, creator, strategy = nil)
      creator ||= User.find_by(is_cli_user: true)
      _basename, ingestion, strategy = start(path, creator, strategy)
      validate_strategy(strategy)
      set_ingestion_text(strategy, ingestion)
      res = do_ingestion(strategy, ingestion)
      ingestion.teardown
      res
    end

    def ingest_update(path, creator, text)
      creator ||= User.find_by(is_cli_user: true)
      _basename, ingestion, strategy = start(path, creator)
      validate_strategy(strategy)
      ingestion.text = text
      res = do_ingestion(strategy, ingestion)
      ingestion.teardown
      res
    end

    def ingest_new(path, creator)
      creator ||= User.find_by(is_cli_user: true)
      _basename, ingestion, strategy = start(path, creator)
      validate_strategy(strategy)
      id = strategy.unique_id(ingestion)
      ingestion.text.unique_identifier = id
      res = do_ingestion(strategy, ingestion)
      ingestion.teardown
      res
    end

    def determine_strategy(path, creator)
      creator ||= User.find_by(is_cli_user: true)
      _basename, ingestion, strategy = start(path, creator)
      validate_strategy(strategy)
      ingestion.teardown
      strategy.name
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

    protected

    def do_ingestion(strategy, ingestion)
      strategy.ingest(ingestion)
      info "services.ingestor.logging.ingestion_end"
      return ingestion.text
    rescue Ingestor::IngestionFailed => e
      logger.error(e.message)
      nil
    end

    # @private
    # @return [Array] Array with [basename, ingestion, strategy]
    def start(path, creator, strategy = nil)
      basename = File.basename(path)
      significant "services.ingestor.logging.ingestion_start", name: basename
      ingestion = Ingestor::Ingestion.new(path, creator, logger)
      final_strategy = strategy || Ingestor::Strategy.for(ingestion, logger)
      return [basename, ingestion, nil] unless final_strategy
      info "services.ingestor.logging.using_strategy", strategy: final_strategy
      [basename, ingestion, final_strategy]
    end

    def validate_strategy(strategy)
      return unless strategy.nil?
      raise Ingestor::IngestionFailed,
            I18n.t("services.ingestor.failures.strategy_not_found").red
    end

    def set_ingestion_text(strategy, ingestion)
      id = strategy.unique_id(ingestion)
      text = Text.where(unique_identifier: id).first
      if text
        info "services.ingestor.logging.text_found", id: text.id
        ingestion.text = text if text
      else
        info "services.ingestor.logging.text_not_found", id: id
        ingestion.text.unique_identifier = id
      end
    end
  end
end
