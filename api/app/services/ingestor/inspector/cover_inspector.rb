module Ingestor
  module Inspector
    # Abstract class for cover inspectors
    class CoverInspector

      # Must return an ingestion source
      def cover
        raise NotImplementedError, "Title Inspector should implement 'cover'"
      end

    end
  end
end
