module Packaging
  module EpubV3
    module TextSectionCompilation
      # Step up the initial state for compiling a {TextSection}.
      class Prepare
        include Packaging::PipelineOperation

        # @param [TextSection] text_section
        # @return [Dry::Types::Result(Hash)]
        def call(text_section)
          node = HTMLNodes::Node.new text_section.body_json

          build_state node: node, text_section: text_section
        end
      end
    end
  end
end
