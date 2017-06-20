require "filesize"

module Ingestor
  module Strategy
    module EPUB
      # The <tt>Ingestor::Strategy::EPUB</tt> class provides a strategy for ingesting
      # EPUB documents into Manifold.
      #
      # @author Zach Davis
      class Strategy < Ingestor::Strategy::Base
        include Ingestor::Loggable

        def self.can_ingest?(ingestion)
          ingestion.dir?("META-INF")
        end

        def self.unique_id(ingestion)
          inspector(ingestion).unique_id
        end

        def self.inspector(ingestion)
          ::Ingestor::Strategy::EPUB::Inspector::EPUB.new(ingestion)
        end

        def self.ingest(ingestion)
          new(ingestion).ingest
        end

        def initialize(ingestion)
          @ingestion = ingestion
          @logger = @ingestion.logger ||
                    Naught.build { |config| config.mimic Logger }
        end

        def ingest
          text = @ingestion.text
          i = self.class.inspector(@ingestion)
          info "services.ingestor.strategy.ePUB.log.version",
               version: i.epub_version
          b = ::Ingestor::Strategy::EPUB::Builder.new(i, @ingestion.logger)
          b.build(text)
          text
        end
      end
    end
  end
end
