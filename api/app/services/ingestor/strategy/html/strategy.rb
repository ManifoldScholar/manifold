require "filesize"

module Ingestor
  module Strategy
    module Html
      # The <tt>Ingestor::Strategy::HTML</tt> class provides a strategy for ingesting
      # a single HTLM document into Manifold.
      #
      # @author Zach Davis
      class Strategy < Ingestor::Strategy::Base
        include Ingestor::Loggable

        def self.label
          "HTML"
        end

        # Return true if the file has .fld and .html
        def self.can_ingest?(ingestion)
          i = inspector(ingestion)
          result = i.html_doc?
          result
        end

        def self.unique_id(ingestion)
          inspector(ingestion).unique_id
        end

        def self.ingest(ingestion)
          new(ingestion).preprocess(ingestion).ingest
        end

        def self.inspector(ingestion)
          ::Ingestor::Strategy::Html::Inspector::Html.new(ingestion)
        end

        def initialize(ingestion)
          @ingestion = ingestion
          @logger = @ingestion.logger ||
                    Naught.build { |config| config.mimic Logger }
        end

        def preprocess(ingestion)
          inspector = self.class.inspector(ingestion)
          path = ingestion.abs(inspector.index_path)
          ::Ingestor::Preprocessor::HTML.process!(path)
          self
        end

        def ingest
          text = @ingestion.text
          i = self.class.inspector(@ingestion)
          b = ::Ingestor::Strategy::Html::Builder.new(i, @ingestion.logger)
          b.build(text)
          text
        end
      end
    end
  end
end
