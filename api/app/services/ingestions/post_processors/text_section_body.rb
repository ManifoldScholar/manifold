require "pathname"
require "uri"
require "cgi"

module Ingestions
  module PostProcessors
    class TextSectionBody < AbstractInteraction
      object :text
      object :text_section

      delegate :source_body, to: :text_section
      delegate :body, to: :text_section

      # A multidimensional array of tags and attributes that the
      # TextSectionBody transformer will transform.
      URI_ATTRIBUTES = [
        %w(a href),
        %w(img src),
        %w(image href),
        %w(base href),
        %w(iframe src),
        %w(link href),
        %w(script src),
        %w(audio src),
        %w(embed src),
        %w(source src),
        %w(video poster),
        %w(video src)
      ].freeze

      def execute
        info "services.ingestions.post_processor.log.transform_ts",
             name: text_section.name
        text_section.update(
          body: convert_body
        )
      end

      private

      def source_path
        text_section.ingestion_source.source_path
      end

      def doc
        @doc ||= initialize_doc
      end

      def initialize_doc
        body = Validator::HTML.new.validate(source_body)
        Nokogiri::HTML(body)
      end

      def body
        doc.css("body").children.to_s.strip
      end

      def convert_body
        return unless source_body.present?

        source_path_map = text.source_path_map
        source_map = text.section_source_map
        transform_doc_uris(doc, source_path_map,
                           source_map, source_path)
        body
      end

      def transform_doc_uris(doc, source_path_map, source_map, source_path)
        URI_ATTRIBUTES.each do |set|
          tag_name, attr_name = set
          doc.css(tag_name).each do |node|
            next unless node.attributes[attr_name]

            transform_node_uri(node, attr_name, source_path_map,
                               source_map, source_path)
          end
        end
      end

      def transform_node_uri(node, attr_name, source_path_map,
                             source_map, source_path)
        node.attributes[attr_name].value = map_uri(
          node.attributes[attr_name].value,
          source_path, source_path_map, source_map
        )
      end

      def map_uri(input_uri, cd_source_path,
                  source_path_map, section_source_map)
        new_uri = URI(input_uri)
        if !new_uri.path.blank? && !new_uri.scheme
          new_path = uri_to_app_uri(new_uri, cd_source_path,
                                    source_path_map, section_source_map)
          new_uri.path = new_path if new_path
        end
        new_uri.to_s
      rescue URI::Error
        input_uri
      end

      def uri_to_app_uri(uri, source_path,
                         source_path_map, section_source_map)
        abs_package_path = abs_package_path(uri, source_path)
        if section_source_map.key? abs_package_path
          section_id = section_source_map[abs_package_path].id
          "/read/#{text.id}/section/#{section_id}"
        elsif source_path_map.key? abs_package_path
          URI(source_path_map[abs_package_path]).path
        end
      end

      def abs_package_path(uri, source_path)
        to_absolute_package_path(uri, source_path)
      end

      # Path is the URI we're making absolute
      # Source_doc is the path of the document that the relative link appears in
      def to_absolute_package_path(path, source_doc_path)
        uri = URI(path)
        package_path = if uri.absolute? || uri.path.start_with?("/")
                         uri.path[1..]
                       else
                         File.expand_path("/" +
                                            File.dirname(source_doc_path) +
                                            "/" +
                                            uri.path)[1..]
                       end
        CGI.unescape package_path
      end

    end
  end
end
