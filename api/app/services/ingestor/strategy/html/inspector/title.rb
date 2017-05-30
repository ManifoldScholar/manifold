module Ingestor
  module Strategy
    module Html
      module Inspector
        # Inspects Word title
        class Title < ::Ingestor::Inspector::TitleInspector

          include ::Ingestor::Inspector::HTML::Title

        end
      end
    end
  end
end
