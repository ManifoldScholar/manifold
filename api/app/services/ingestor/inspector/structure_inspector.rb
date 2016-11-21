module Ingestor
  module Inspector
    # Abstract class for structure inspectors
    class StructureInspector

      def toc
        raise NotImplementedError, "Structure Inspector should implement 'toc'"
      end

      def landmarks
        raise NotImplementedError, "Structure Inspector should implement 'landmarks'"
      end

      def page_list
        raise NotImplementedError, "Structure Inspector should implement 'page_list'"
      end

    end
  end
end
