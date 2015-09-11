require 'naught'
require 'URI'

module Ingestor
  module Strategy
    module EPUB3
      module Transformer
        class TextSection

          def initialize(text, logger = nil)
            @text = text
            @logger = logger || Naught.build
          end

          def uri_attributes
            [
                ['a', 'href'],
                ['img', 'src'],
                ['base', 'href'],
                ['iframe', 'src'],
                ['link', 'href'],
                ['script', 'src'],
                ['audio', 'src'],
                ['embed', 'src'],
                ['source', 'src'],
                ['video', 'poster'],
                ['video', 'src']
            ]
          end

          def convert_cont_doc_body(body, source_path)
            resource_map = @text.ingestion_resource_map
            section_source_map = @text.section_source_map
            doc = Nokogiri::HTML(body)
            uri_attributes.each do |set|
              tag_name, attr_name = set
              doc.css(tag_name).each do |node|
                if node.attributes[attr_name]
                  node.attributes[attr_name].value = map_uri(node.attributes[attr_name].value, source_path, resource_map, section_source_map)
                end
              end
            end
            return doc.css('body').children.to_s.strip
          end

          private

          def map_uri(input_uri, cd_source_path, resource_map, section_source_map)
            uri = URI(input_uri)
            if !uri.path.blank? && !uri.scheme
              abs_package_path = Helper::URI.to_absolute_package_path(input_uri, cd_source_path)
              if section_source_map.has_key? abs_package_path
                new_path = "/text/#{@text.id}/section/#{section_source_map[abs_package_path].id}"
              elsif resource_map.has_key? abs_package_path
                new_path = URI(resource_map[abs_package_path]).path
              end
              uri.path = new_path
              s = uri.to_s
              @logger.debug "Mapping URI"
              @logger.debug "  #{abs_package_path}"
              @logger.debug "  #{s}"
              return s
            else
              uri.to_s
            end
          end
        end
      end
    end
  end
end