module Ingestions
  module PostProcessors
    class TextSectionBody < AbstractInteraction
      object :text
      object :text_section

      delegate :source_body, to: :text_section

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
        text_section.update(
          body: convert_doc_body,
          body_json: convert_doc_body_to_json
        )
      end

      private

      def source_path
        text_section.ingestion_source.source_path
      end

      # rubocop:disable Metrics/AbcSize
      def convert_doc_body
        return unless source_body.present?
        source_path_map = text.source_path_map
        source_map = text.section_source_map
        body = Validator::Html.new.validate(source_body)
        doc = Nokogiri::HTML(body)
        transform_doc_uris(doc, source_path_map,
                           source_map, source_path)
        doc.css("body").children.to_s.strip
      end
      # rubocop:enable Metrics/AbcSize

      def convert_doc_body_to_json
        return unless source_body.present?
        Serializer::Html.serialize_as_json(source_body) do |json|
          if json.blank?
            error_string(source_body)

            raise "Body contains no nodes"
          end
        end
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
          new_path = epub_uri_to_app_uri(new_uri, cd_source_path,
                                         source_path_map, section_source_map)
          new_uri.path = new_path if new_path
          # TODO: -  warn if you can't map.
        end
        new_uri.to_s
      rescue URI::InvalidURIError
        input_uri
      end

      def epub_uri_to_app_uri(epub_uri, source_path,
                              source_path_map, section_source_map)
        abs_package_path = abs_package_path(epub_uri, source_path)
        if section_source_map.key? abs_package_path
          section_id = section_source_map[abs_package_path].id
          new_path = "/read/#{text.id}/section/#{section_id}"
        elsif source_path_map.key? abs_package_path
          new_path = URI(source_path_map[abs_package_path]).path
        end
        log_map_uri(abs_package_path, new_path.to_s)
        new_path
      end

      def abs_package_path(epub_uri, source_path)
        Helper::URI.to_absolute_package_path(epub_uri, source_path)
      end

    end
  end
end
