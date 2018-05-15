require "redcarpet"

module Ingestor
  module Strategy
    module Markdown
      module Inspector
        # Inspects Markdown structures.  We convert our markdown to HTML,
        # so we inherit from the HTML structure.
        class Structure < ::Ingestor::Strategy::Html::Inspector::Structure

          def initialize(markdown_inspector)
            @markdown_inspector = markdown_inspector
            @ingestion = @markdown_inspector.ingestion
          end

          protected

          # specific to this implementation
          def toc_node
            Nokogiri::XML("<body>" + nav_xml + "</body>").xpath(selector_toc_root_node)[0]
          end

          def nav_xml
            markdown = @ingestion.read(@markdown_inspector.summary_path)
            renderer = Redcarpet::Render::HTML.new
            redcarpet = Redcarpet::Markdown.new(renderer, fenced_code_blocks: true)
            redcarpet.render(markdown)
          end

        end
      end
    end
  end
end
