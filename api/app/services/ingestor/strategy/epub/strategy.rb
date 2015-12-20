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

        def initialize(ingestion)
          @ingestion = ingestion
          @inspector = Inspector::EPUB.new(@ingestion.source_path,
                                           @ingestion.logger)
          @logger = @ingestion.logger ||
                    Naught.build { |config| config.mimic Logger }
        end

        def self.can_ingest?(ingestion)
          inspector = Inspector::EPUB.new(ingestion.source_path,
                                          ingestion.logger)
          return false if inspector.epub_extension != "epub"
          return false unless inspector.v2? || inspector.v3?
          true
        end

        def self.unique_id(ingestion)
          inspector = Inspector::EPUB.new(ingestion.source_path,
                                          ingestion.logger)
          inspector.unique_id
        end

        def self.ingest(ingestion)
          new(ingestion).ingest
        end

        def ingest
          info "services.ingestor.strategy.ePUB.log.version", version: @inspector.epub_version
          text = @ingestion.text
          Builder.new(@inspector, @logger).build(text)
          text
        end
      end
    end
  end
end
