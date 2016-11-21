module Ingestor
  module Inspector
    # Abstract class for stylesheet inspectors
    class StylesheetInspector

      def name
        raise NotImplementedError, "Stylesheet Inspector should implement 'name'"
      end

      def source_identifier
        raise NotImplementedError,
              "Stylesheet Inspector should implement 'source_identifier'"
      end

      def raw_styles
        raise NotImplementedError, "Stylesheet Inspector should implement 'raw_styles'"
      end

      def ingestion_source(_text)
        raise NotImplementedError,
              "Stylesheet Inspector should implement 'ingestion_source'"
      end

    end
  end
end
