module Ingestor
  module Strategy
    module GoogleDoc
      module Inspector
        # Inspects GoogleDoc title
        class Title < ::Ingestor::Inspector::TitleInspector

          include ::Ingestor::Inspector::HTML::Title

        end
      end
    end
  end
end
