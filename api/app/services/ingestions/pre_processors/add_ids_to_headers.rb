module Ingestions
  module PreProcessors
    class AddIdsToHeaders < AbstractInteraction
      hash :manifest, strip: false

      def execute
        add_ids
      end

      private

      def text_section_attributes
        @text_section_attributes ||= manifest[:relationships][:text_sections]
      end

      def add_ids
        text_section_attributes.each do |section|
          doc = parse(section)
          add_header_ids!(doc)
          context.write section[:build], doc.to_s.strip
        end
      end

      def parse(section)
        Nokogiri::HTML(context.read(section[:build]), nil)
      end

      def header_nodes(doc)
        doc.xpath("//h1 | //h2 | //h3 | //h4 | //h5 | //h6")
      end

      def add_header_ids!(doc)
        header_nodes(doc).each_with_index do |node, index|
          next if node["id"]
          node["id"] = Digest::MD5.hexdigest(index.to_s + node.name + node.text)
        end
      end

    end
  end
end
