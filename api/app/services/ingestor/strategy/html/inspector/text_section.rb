require "digest"
require "redcarpet"

module Ingestor
  module Strategy
    module Html
      module Inspector
        # Inspects Word text sections
        class TextSection < ::Ingestor::Inspector::TextSectionInspector

          include ::Ingestor::Inspector::HTML::TextSection

        end
      end
    end
  end
end
