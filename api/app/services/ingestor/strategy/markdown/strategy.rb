require "filesize"

module Ingestor
  module Strategy
    module Markdown
      # The <tt>Ingestor::Strategy::Markdown</tt> class provides a strategy for ingesting
      # Markdown source documents into Manifold.
      #
      # @author Zach Davis
      class Strategy < Ingestor::Strategy::Base
        include Ingestions::Concerns::Loggable

        def self.label
          "Markdown"
        end

        def self.can_ingest?(ingestion)
          i = inspector(ingestion)
          result = i.markdown?
          result
        end

        def self.unique_id(ingestion)
          inspector(ingestion).unique_id
        end

        def self.inspector(ingestion)
          ::Ingestor::Strategy::Markdown::Inspector::Markdown.new(ingestion)
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
          b = ::Ingestor::Strategy::Markdown::Builder.new(i, @ingestion.logger)
          b.build(text)
          text
        end
      end
    end
  end
end
