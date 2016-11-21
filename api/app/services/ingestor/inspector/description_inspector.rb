module Ingestor
  module Inspector
    # Abstract class for description inspectors
    class DescriptionInspector

      def description
        raise NotImplementedError, "Description Inspector should implement 'description'"
      end

    end
  end
end
