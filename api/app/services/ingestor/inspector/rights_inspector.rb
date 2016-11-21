module Ingestor
  module Inspector
    # Abstract class for rights inspectors
    class RightsInspector

      def rights
        raise NotImplementedError, "Rights Inspector should implement 'rights'"
      end

    end
  end
end
