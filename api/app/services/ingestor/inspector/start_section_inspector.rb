module Ingestor
  module Inspector
    # Abstract class for rights inspectors
    class RightsInspector

      def start_section_identifier
        raise NotImplementedError,
              "Start Section Inspector should implement 'start_section_identifier'"
      end

    end
  end
end
