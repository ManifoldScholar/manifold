module Ingestor
  module Inspector
    # Abstract class for spine inspectors
    class SpineInspector

      def spine_source_ids
        raise NotImplementedError, "Spine Inspector should implement 'spine_source_ids'"
      end

    end
  end
end
