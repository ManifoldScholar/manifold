module Ingestor
  module Inspector
    # Abstract class for titleinspectors
    class TitleInspector

      def value
        raise NotImplementedError, "Title Inspector should implement 'value'"
      end

      def kind
        raise NotImplementedError, "Title Inspector should implement 'kind'"
      end

      def position
        raise NotImplementedError, "Title Inspector should implement 'position'"
      end

    end
  end
end
