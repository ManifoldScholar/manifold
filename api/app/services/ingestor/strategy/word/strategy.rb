require "filesize"

module Ingestor
  module Strategy
    module Word
      # The <tt>Ingestor::Strategy::Word</tt> class provides a strategy for ingesting
      # Word source documents into Manifold.
      #
      # @author Max Ono
      class Strategy < Ingestor::Strategy::Base
        include Ingestor::Loggable

        def initialize(ingestion)
          @ingestion = ingestion
          @inspector = ::Ingestor::Strategy::Word::Inspector::Word.new(
            @ingestion.source_path,
            @ingestion.logger
          )
          @logger = @ingestion.logger ||
                    Naught.build { |config| config.mimic Logger }
        end

        # Return true if the file has .fld and .html
        def self.can_ingest?(ingestion)
          inspector = ::Ingestor::Strategy::Word::Inspector::Word.new(
            ingestion.source_path,
            ingestion.logger
          )
          inspector.word_doc?
        end

        # Return an MD5 string of based on the file contents;
        def self.unique_id(ingestion)
          inspector = ::Ingestor::Strategy::Word::Inspector::Word.new(
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
          ::Ingestor::Strategy::Word::Builder.new(@inspector, @logger).build(text)
          text
        end
      end
    end
  end
end
