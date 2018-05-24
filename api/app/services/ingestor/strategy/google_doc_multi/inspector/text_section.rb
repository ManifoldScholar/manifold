require "digest"
require "redcarpet"

module Ingestor
  module Strategy
    module GoogleDocMulti
      module Inspector
        class TextSection < ::Ingestor::Strategy::Html::Inspector::TextSection
          # This inspector is referencing html_inspector because it inherits from
          # the HTML TextSection Inspector.  All we're doing differently for this
          # class is changing where the name is generated from.

          def name
            source_item = source_map_item rel_path
            source_item&.dig(:title) || basename.titleize
          end

          protected

          def source_map_item(path)
            source_map.detect { |_id, values| values[:source_path] == path }&.last
          end

          def source_map
            html_inspector.source_map
          end
        end
      end
    end
  end
end
