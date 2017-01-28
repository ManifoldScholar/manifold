require "filesize"

module Ingestor
  module Strategy
    module GoogleDoc
      # The <tt>Ingestor::Strategy::GoogleDoc</tt> class provides a strategy for ingesting
      # Google Doc source documents into Manifold.
      #
      # @author Max Ono
      class Strategy < Ingestor::Strategy::Base
        include Ingestor::Loggable

        def initialize(ingestion)
          @ingestion = ingestion
          @inspector =
            ::Ingestor::Strategy::GoogleDoc::Inspector::GoogleDoc.new(
              @ingestion.source_path,
              @ingestion.logger
            )
          @logger = @ingestion.logger ||
                    Naught.build { |config| config.mimic Logger }
        end

        # Return true if the url is valid
        def self.can_ingest?(ingestion)
          inspector = create_inspector(ingestion)
          inspector.google_doc?
        end

        # Return an MD5 string of based on the file contents;
        def self.unique_id(ingestion)
          inspector = create_inspector(ingestion)
          inspector.unique_id
        end

        def self.ingest(ingestion)
          new(ingestion).ingest
        end

        def ingest
          text = @ingestion.text
          ::Ingestor::Strategy::GoogleDoc::Builder.new(@inspector, @logger).build(text)
          text
        end

        private_class_method

        def self.create_inspector(ingestion)
          ::Ingestor::Strategy::GoogleDoc::Inspector::GoogleDoc.new(
            ingestion.source_path,
            ingestion.logger
          )
        end

      end
    end
  end
end
