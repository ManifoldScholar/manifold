module Ingestions
  class Context
    include Ingestions::Concerns::Loggable
    include Ingestions::Concerns::FileOperations

    attr_reader :ingestion, :source_path, :identifier, :creator, :loggable

    def initialize(ingestion, loggable = nil)
      @ingestion = ingestion
      @identifier = ingestion.id
      @creator = ingestion.creator
      source = ingestion_source_tempfile(ingestion)
      @source = source[:file]
      @source_title = source[:title]
      @source_path = @source.path
      @loggable = loggable
      @source_provided = false

      initialize_working_dirs
      update_working_dirs @source, @source_title
    end

    def ingestion_source_tempfile(ingestion)
      return { file: ingestion.source_tempfile, title: nil } if ingestion.file_based_ingestion?

      outcome = Ingestions::Fetcher.run(context: self, url: ingestion.external_source_url)

      raise IngestionError, "Unable to fetch ingestion source from #{ingestion.external_source_url}" unless outcome.valid?

      outcome.result
    end

    def logger
      loggable || ingestion || Rails.logger
    end

    def source_provided?
      @source_provided.present?
    end

    def google_doc_url?
      source_url.start_with?("https://docs.google.com/")
    end

    # @param [Symbol] strategy_name
    # @return [void]
    def set_used_strategy!(strategy_name)
      ingestion.update ingestion_type: strategy_name.demodulize.underscore,
                       strategy: strategy_name.to_s
    end

    def to_fetcher_inputs
      {
        context: self,
        url: source_path
      }
    end

    private

    # Makes the working directories and sets up the source files
    # for an ingestion.
    def initialize_working_dirs
      ensure_root
      ensure_working_dirs
    end

  end
end
