module Ingestor
  module Inspector
    # Abstract class for text section inspectors
    class TextSectionInspector

      def source_identifier
        raise NotImplementedError,
              "TextSection Inspector should implement 'source_identifier'"
      end

      def name
        raise NotImplementedError,
              "TextSection Inspector should implement 'name'"
      end

      def source_body
        raise NotImplementedError,
              "TextSection Inspector should implement 'source_body'"
      end

      def kind
        raise NotImplementedError,
              "TextSection Inspector should implement 'kind'"
      end

      def ingestion_source(_text)
        raise NotImplementedError,
              "TextSection Inspector should implement 'ingestion_source'"
      end

    end
  end
end
