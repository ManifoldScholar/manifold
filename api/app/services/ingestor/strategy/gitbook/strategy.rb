require "filesize"

module Ingestor
  module Strategy
    module Gitbook
      # The <tt>Ingestor::Strategy::Gitbook</tt> class provides a strategy for ingesting
      # Gitbook source documents into Manifold.
      #
      # @author Zach Davis
      class Strategy < Ingestor::Strategy::Base
        include Ingestor::Loggable

        def initialize(ingestion)
          @ingestion = ingestion
          @inspector = ::Ingestor::Strategy::Gitbook::Inspector::Gitbook.new(
            @ingestion.source_path,
            @ingestion.logger
          )
          @logger = @ingestion.logger ||
                    Naught.build { |config| config.mimic Logger }
        end

        def self.can_ingest?(ingestion)
          inspector = ::Ingestor::Strategy::Gitbook::Inspector::Gitbook.new(
            ingestion.source_path,
            ingestion.logger
          )
          inspector.gitbook?
        end

        def self.unique_id(ingestion)
          inspector = ::Ingestor::Strategy::Gitbook::Inspector::Gitbook.new(
            ingestion.source_path,
            ingestion.logger
          )
          inspector.unique_id
        end

        def self.ingest(ingestion)
          new(ingestion).ingest
        end

        def ingest
          text = @ingestion.text
          ::Ingestor::Strategy::Gitbook::Builder.new(@inspector, @logger).build(text)
          text
        end
      end
    end
  end
end
