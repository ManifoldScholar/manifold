module Ingestor
  module Inspector
    # Abstract class for date inspectors
    class DateInspector

      def date
        raise NotImplementedError, "Date Inspector should implement 'date'"
      end

    end
  end
end
