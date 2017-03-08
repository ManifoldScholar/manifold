module Ingestor
  module Inspector
    # Abstract class for ingestion source inspectors
    class IngestionSourceInspector

      def source_path
        raise NotImplementedError,
              "Ingestion Source Inspector should implement 'source_path'"
      end

      def source_identifier
        raise NotImplementedError,
              "Ingestion Source Inspector should implement 'source_identifier'"
      end

      def kind
        raise NotImplementedError,
              "Ingestion Source Inspector should implement 'kind'"
      end

      def attachment
        raise NotImplementedError,
              "Ingestion Source Inspector should implement 'attachment'"
      end

    end
  end
end
