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
    end

    # Makes the working directories and sets up the source files
    # for an ingestion.  If the source is a URL, we fetch the file
    # first.  Then we extract the files (if zip, epub, etc.) or copy
    # the files into the /source working dir.
    def initialize_working_dirs
      ensure_root
      ensure_working_dirs
      path = source_path
      tmp_file = nil

      tmp_file, path = fetch if url?

      update_working_dirs path
    ensure
      tmp_file.unlink if tmp_file.present?
    end

    def fetch
      outcome = if google_doc_url?
                  Fetchers::GoogleDoc.run context: self
                else
                  Fetchers::URL.run context: self
                end

      outcome.result
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
