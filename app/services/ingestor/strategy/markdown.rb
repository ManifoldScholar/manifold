module Ingestor
  module Strategy
    class Markdown < Base

      def self.can_ingest?(ingestion)
        ingestion.extension == 'md'
      end

      def self.ingest
      end

    end
  end
end

