require "naught"
require "uri"

module Ingestor
  module Transformer
    # The <tt>TextSection</tt> transformer transforms URIs within an
    # imported EPUB content document.
    #
    # The EPUB strategy creates Manifold TextSection domain models from
    # EPUB content documents. When the TextSections are created, all of
    # the URIs are left as is, which generally means that they link to
    # other documents within the EPUB. These URIs all need to be updated
    # to follow Manifold routing conventions, which is the job of the
    # TextSection transformer.
    #
    # @author Zach Davis
    # @todo Replace hard-coded reader paths with a custom link syntax. We
    #   don't want to hard-code front-end routes in our content.
    class TextSection
      include Ingestions::Concerns::Loggable

      # A multidimensional array of tags and attributes that the
      # TextSection transformer will transform.
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

      # @param [Text] text A Text model instance with TextSections that
      #   require transformation
      # @param [Logger] logger A logger object that implements the Ruby
      #   Logger interface
      def initialize(text, logger = nil)
        @text = text
        @logger = logger || Naught.build
      end

      # Transforms relative and absoulte URIs within body to point at other
      # ingested text sections.
      #
      # @param [String] body Text content, typically HTML, from the EPUB
      #   content document.
      # @param [String] source_path EPUB documents often rely on relative
      #   links. To correctly resolve the URI to a content document, we
      #   need to know the path of the source document that the link comes
      #   from.
      # @return [String] the updated section body, with rewritten internal
      #   links.
      def convert_cont_doc_body(body, source_path)
        return unless body
        source_path_map = @text.source_path_map
        source_map = @text.section_source_map
        body = Validator::Html.new.validate(body)
        doc = Nokogiri::HTML(body)
        transform_doc_uris(doc, source_path_map,
                           source_map, source_path)
        doc.css("body").children.to_s.strip
      end

      def convert_cont_doc_body_to_json(body)
        return unless body
        Serializer::Html.serialize_as_json(body) do |json|
          if json.blank?
            error_string(body)

            raise "Body contains no nodes"
          end
        end
      end

      private

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
          new_path = "/read/#{@text.id}/section/#{section_id}"
        elsif source_path_map.key? abs_package_path
          new_path = URI(source_path_map[abs_package_path]).path
        end
        log_map_uri(abs_package_path, new_path.to_s)
        new_path
      end

      def abs_package_path(epub_uri, source_path)
        Helper::URI.to_absolute_package_path(epub_uri, source_path)
      end

      def log_map_uri(abs_package_path, uri)
        debug "services.ingestor.strategy.ePUB.log.mapping_uri"
        debug_string "  #{abs_package_path}"
        debug_string "  #{uri}"
      end
    end
  end
end
