module Ingestions
  module PreProcessors
    class ExtractTextSectionBodies < AbstractInteraction
      hash :manifest, strip: false

      def execute
        write_text_section_bodies
      end

      private

      def text_section_attributes
        @text_section_attributes ||= manifest[:relationships][:text_sections]
      end

      def write_text_section_bodies
        text_section_attributes.each do |section|
          parsed = parsed_body(section)
          path = section[:build]

          context.write path, parsed
        end
      end

      def parsed_body(section)
        build_file = section[:build]
        doc = Nokogiri::HTML(context.read(build_file), nil)
        doc.at("body").children.to_s.strip
      end
    end
  end
end
