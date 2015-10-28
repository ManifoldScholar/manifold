module Ingestor
  module Strategy
    # The <tt>Ingestor::Strategy::Markdown</tt> class is a Manifold ingestion
    # strategy that can consume a directory of markdown documents. This class
    # is pending, and current contains no functionality.
    #
    # @author Zach Davis
    # @todo This is merely a placeholder. The class still needs to be created.
    class Markdown < Base
      # Returns a new instance of the Markdown strategy
      #
      # @param [Ingestion] ingestion the Ingestion object
      def initialize(ingestion)
        @ingestion = ingestion
        @logger = @ingestion.logger || Naught.build do |config|
          config.mimic Logger
        end
      end

      # Return true if the ingestion subject is a file with a .md extension.
      #
      # @author Zach Davis
      # @param [Ingestion] ingestion the Ingestion object
      # @return [Boolean] true if the strategy can handle this ingestion,
      #   false if not
      def self.can_ingest?(ingestion)
        ingestion.extension == "md"
      end

      # Ingests the ingestion subject, in doing so, updates the ingestion text
      # model.
      #
      # @todo Write the business logic for the markdown strategy.
      # @return [Text] the updated Text model
      def self.ingest
        @ingestion.text
      end
    end
  end
end
