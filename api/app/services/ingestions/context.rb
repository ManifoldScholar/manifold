module Ingestions
  class Context
    include Ingestions::Concerns::Loggable
    include Ingestions::Concerns::FileOperations

    attr_reader :ingestion, :source_path, :identifier, :creator, :loggable

    def initialize(ingestion, loggable = nil)
      @ingestion = ingestion
      @source_path = ingestion.ingestion_source
      @identifier = ingestion.id
      @creator = ingestion.creator
      @loggable = loggable
      @source_provided = false

      initialize_working_dirs

      yield self if block_given?
    end

    def logger
      loggable || ingestion || Rails.logger
    end

    def source_provided?
      @source_provided.present?
    end

    def source=(fetched)
      raise "Already provided source" if source_provided?

      source = fetched.present? ? fetched[:file].path : source_path

      update_working_dirs source

      @source_provided = true
    end

    def google_doc_url?
      source_url.start_with?("https://docs.google.com/")
    end

    # @param [Symbol] strategy_name
    # @return [void]
    # rubocop:disable Naming/AccessorMethodName
    def set_used_strategy!(strategy_name)
      ingestion.update ingestion_type: strategy_name.demodulize.underscore,
                       strategy: strategy_name.to_s
    end
    # rubocop:enable Naming/AccessorMethodName

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
