module Ingestions
  module Strategy
    module Epub
      # Inspects epub for a single title
      class Title

        def initialize(title_node, epub_inspector)
          @title_node = title_node
          @epub_inspector = epub_inspector
        end

        def attributes
          {
            value: value,
            position: position,
            kind: kind
          }
        end

        def value
          @title_node.text
        end

        def position
          path = "//xmlns:meta[@refines='##{id}' and @property='display-seq']"
          node = @epub_inspector.metadata_node.xpath(path)
          return nil unless node

          node&.text.to_i.nonzero?
        end

        def kind
          path = "//xmlns:meta[@refines='##{id}' and @property='title-type']"
          node = @epub_inspector.metadata_node.xpath(path)
          return nil unless node.nil?

          scheme = node.attribute("scheme")&.value
          return onix_code_to_type(node.text) if scheme && scheme == "onix:codelist15"

          node&.text
        end

        protected

        # rubocop:disable Metrics/CyclomaticComplexity
        # rubocop:disable Metrics/MethodLength
        def onix_code_to_type(code)
          case code.to_i
          when 1, 2, 3, 7
            ::TextTitle::KIND_MAIN
          when 4
            ::TextTitle::KIND_ACRONYM
          when 5
            ::TextTitle::KIND_ABBREVIATED
          when 6
            ::TextTitle::KIND_TRANSLATED
          when 8
            ::TextTitle::KIND_FORMER
          when 11
            ::TextTitle::KIND_ALTERNATIVE_COVER
          when 12
            ::TextTitle::KIND_ALTERNATIVE_BACK
          when 13
            ::TextTitle::KIND_EXPANDED
          when 14
            ::TextTitle::KIND_ALTERNATIVE
          end
        end
        # rubocop:enable Metrics/MethodLength
        # rubocop:enable Metrics/CyclomaticComplexity

        def id
          @title_node.attribute("id")&.value
        end

      end
    end
  end
end
