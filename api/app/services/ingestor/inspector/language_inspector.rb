module Ingestor
  module Inspector
    # Abstract class for language inspectors
    class LanguageInspector

      def language
        raise NotImplementedError, "Language Inspector should implement 'language'"
      end

    end
  end
end
