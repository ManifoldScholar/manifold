require "naught"
require "uri"

module Ingestor
  module Strategy
    module EPUB3
      module Transformer
        # The <tt>TextSection</tt> transformer transforms URIs within an
        # imported EPUB3 content document.
        #
        # The EPUB3 strategy creates Manifold TextSection domain models from
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
          include Ingestor::Loggable

          # A multidimensional array of tags and attributes that the
          # TextSection transformer will transform.
          URI_ATTRIBUTES = [
            %w(a href),
            %w(img src),
            %w(base href),
            %w(iframe src),
            %w(link href),
            %w(script src),
            %w(audio src),
            %w(embed src),
            %w(source src),
            %w(video poster),
            %w(video src)
          ]

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
          # @param [String] source_path EPUB3 documents often rely on relative
          #   links. To correctly resolve the URI to a content document, we
          #   need to know the path of the source document that the link comes
          #   from.
          # @return [String] the updated section body, with rewritten internal
          #   links.
          def convert_cont_doc_body(body, source_path)
            resource_map = @text.ingestion_resource_map
            source_map = @text.section_source_map
            body = HtmlValidator.new.validate(body)
            doc = Nokogiri::HTML(body)
            transform_doc_uris(doc, resource_map,
                               source_map, source_path)
            doc.css("body").children.to_s.strip
          end


          def convert_cont_doc_body_to_json(body)
            json = HtmlSerializer.new.serialize(body).to_json
            if json == nil
              puts body
              raise exception
            end
            return json
          end

          private

          def transform_doc_uris(doc, resource_map, source_map,
                                 source_path)
            URI_ATTRIBUTES.each do |set|
              tag_name, attr_name = set
              doc.css(tag_name).each do |node|
                next unless node.attributes[attr_name]
                transform_node_uri(node, attr_name, resource_map,
                                   source_map, source_path)
              end
            end
          end

          def transform_node_uri(node, attr_name, resource_map,
                                 source_map, source_path)
            node.attributes[attr_name].value = map_uri(
              node.attributes[attr_name].value,
              source_path, resource_map, source_map
            )
          end

          def map_uri(input_uri, cd_source_path,
                      resource_map, section_source_map)
            new_uri = URI(input_uri)
            if !new_uri.path.blank? && !new_uri.scheme
              new_path = epub_uri_to_app_uri(new_uri, cd_source_path,
                                             resource_map, section_source_map)
              new_uri.path = new_path
              new_uri.to_s
            else
              new_uri.to_s
            end
          end

          def epub_uri_to_app_uri(epub_uri, source_path,
                                  resource_map, section_source_map)
            abs_package_path = abs_package_path(epub_uri, source_path)
            if section_source_map.key? abs_package_path
              section_id = section_source_map[abs_package_path].id
              new_path = "/read/#{@text.id}/section/#{section_id}"
            elsif resource_map.key? abs_package_path
              new_path = URI(resource_map[abs_package_path]).path
            end
            log_map_uri(abs_package_path, new_path.to_s)
            new_path
          end

          def abs_package_path(epub_uri, source_path)
            Helper::URI.to_absolute_package_path(epub_uri, source_path)
          end

          def log_map_uri(abs_package_path, uri)
            @logger.debug "Mapping URI"
            @logger.debug "  #{abs_package_path}"
            @logger.debug "  #{uri}"
          end
        end
      end
    end
  end
end
