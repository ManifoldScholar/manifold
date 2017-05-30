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

        # Return true if the file has .fld and .html
        def self.can_ingest?(ingestion)
          i = inspector(ingestion)
          result = i.html_doc?
          i.teardown
          result
        end

        # Return an MD5 string of based on the file contents;
        def self.unique_id(ingestion)
          i = inspector(ingestion)
          id = i.unique_id
          i.teardown
          id
        end

        def self.ingest(ingestion)
          new(ingestion).ingest
        end

        def self.inspector(ingestion)
          inspector = ::Ingestor::Strategy::Html::Inspector::Html.new(
            ingestion.source_path,
            ingestion.logger
          )
          inspector.setup
          inspector
        end

        def initialize(ingestion)
          @ingestion = ingestion
          @logger = @ingestion.logger ||
                    Naught.build { |config| config.mimic Logger }
        end

        def ingest
          text = @ingestion.text
          i = self.class.inspector(@ingestion)
          b = ::Ingestor::Strategy::Html::Builder.new(i, @ingestion.logger)
          b.build(text)
          i.teardown
          text
        end
      end
    end
  end
end
