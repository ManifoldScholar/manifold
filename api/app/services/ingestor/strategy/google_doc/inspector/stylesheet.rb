require "digest"

module Ingestor
  module Strategy
    module GoogleDoc
      module Inspector
        # Inspects Word stylesheets
        class Stylesheet < ::Ingestor::Inspector::StylesheetInspector

          include ::Ingestor::Inspector::HTML::Stylesheet

        end
      end
    end
  end
end
