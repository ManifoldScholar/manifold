module Ingestor
  module Strategy
    module Word
      module Inspector
        # Inspects Word title
        class Title < ::Ingestor::Inspector::TitleInspector

          include ::Ingestor::Inspector::HTML::Title

        end
      end
    end
  end
end
