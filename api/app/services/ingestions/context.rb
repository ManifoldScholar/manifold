module Ingestions
  class Context
    include Ingestions::Concerns::Loggable
    include Ingestions::Concerns::FileOperations

    attr_reader :ingestion, :logger, :source_path, :identifier, :creator

    def initialize(ingestion, logger = Rails.logger)
      @ingestion = ingestion
      @logger = logger
      @source_path = ingestion.ingestion_source
      @identifier = ingestion.id
      @creator = ingestion.creator

      initialize_working_dirs
      fetched = maybe_fetch_external_source
      source = fetched.present? ? fetched.path : source_path
      update_working_dirs source
    end

    def maybe_fetch_external_source
      return unless url?
      outcome = fetch
      handle_fetch_error(outcome) unless outcome.valid?
      outcome.result
    end

    def handle_fetch_error(result)
      raise Ingestions::Fetchers::FetchFailed, result.errors.full_messages
    end

    # Makes the working directories and sets up the source files
    # for an ingestion.
    def initialize_working_dirs
      ensure_root
      ensure_working_dirs
    end

    def fetch
      pick = Ingestions::Pickers::Fetcher.run url: source_path
      fetcher = pick.result.interaction
      fetcher.run url: source_path
    end

    def google_doc_url?
      source_url.start_with?("https://docs.google.com/")
    end

    # @param [Symbol] strategy_name
    # @return [void]
    # rubocop:disable Naming/AccessorMethodName
    def set_used_strategy!(strategy_name)
      ingestion.update ingestion_type: strategy_name.underscore
    end
    # rubocop:enable Naming/AccessorMethodName

  end
end
