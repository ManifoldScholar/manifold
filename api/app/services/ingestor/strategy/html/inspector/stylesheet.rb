require "digest"

module Ingestor
  module Strategy
    module Html
      module Inspector
        # Inspects Word stylesheets
        class Stylesheet < ::Ingestor::Inspector::StylesheetInspector

          include ::Ingestor::Inspector::HTML::Stylesheet

        end
      end
    end
  end
end
