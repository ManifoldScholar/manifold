require "memoist"

module Ingestions
  module Strategy
    module Epub
      # Inspects the EPUB document and provides high level information and access to
      # document structure, nodes, etc.
      #
      # @author Zach Davis
      class Inspector
        extend Memoist

        attr_reader :ingestion, :context

        def initialize(context)
          @context = context
          @ingestion = context.ingestion
        end

        def unique_id
          return Digest::MD5.hexdigest(context.source_url) if context.source_url

          rendition_unique_id_node&.content
        end
        memoize :unique_id

        def epub_version
          rendition_package_node_attribute_value("version")
        end
        memoize :epub_version

        def title_nodes
          metadata_node.search("//dc:title", "dc" => dc)
        end
        memoize :title_nodes

        def metadata_node
          rendition_parsed.at("//xmlns:package/xmlns:metadata")
        end
        memoize :metadata_node

        def creator_nodes
          metadata_node.search("//dc:creator", "dc" => dc)
        end
        memoize :creator_nodes

        def contributor_nodes
          metadata_node.search("//dc:contributor", "dc" => dc)
        end
        memoize :contributor_nodes

        def language_node
          metadata_node.at("//dc:language", "dc" => dc)
        end
        memoize :language_node

        def date_node
          metadata_node.xpath(
            "//dc:date[not(@opf:event=\"modification\" or @opf:event=\"creation\")]",
            "dc" => dc,
            "opf" => opf
          )
        end
        memoize :date_node

        def rights_node
          metadata_node.xpath("//dc:rights", "dc" => dc)
        end
        memoize :rights_node

        def description_node
          metadata_node.xpath("//dc:description", "dc" => dc)
        end
        memoize :description_node

        def manifest_item_nodes
          manifest_node.search("//xmlns:item")
        end
        memoize :manifest_item_nodes

        def stylesheet_nodes
          manifest_item_nodes.search("//*[@media-type=\"text/css\"]")
        end
        memoize :stylesheet_nodes

        def spine_item_nodes
          spine_node.xpath("//xmlns:itemref")
        end
        memoize :spine_item_nodes

        def open_rendition_source_by_href(href)
          # Rendition HREFs could be relative to the rendition (OPF) file
          open_rendition_source_by_path(rendition_href_to_path(href))
        end
        memoize :open_rendition_source_by_href

        def read_rendition_source_by_href(href)
          read_rendition_source_by_path(rendition_href_to_path(href))
        end
        memoize :read_rendition_source_by_href

        def toc_inspector
          return TOC.new(self) if nav_parsed

          Naught.build
        end
        memoize :toc_inspector

        def nav_path
          href = manifest_nav_node&.attribute("href")&.value
          context.derelativize_ingestion_path(rendition_path, href)
        end
        memoize :nav_path

        def nav_parsed
          xml_parse(nav_path)
        end
        memoize :nav_parsed

        def v3?
          epub_version.starts_with?("3")
        end
        memoize :v3?

        def v2?
          epub_version.starts_with?("2")
        end
        memoize :v2?

        def rendition_source_node_by_id(id)
          manifest_item_nodes.at("//*[@id='#{id}']")
        end
        memoize :rendition_source_node_by_id

        def rendition_source_node_by_property(property)
          manifest_node.at("//*[contains(@properties, \"#{property}\")]")
        end
        memoize :rendition_source_node_by_property

        def spine_item_parsed(id)
          xml_parse(rendition_source_path_by_id(id))
        end
        memoize :spine_item_parsed

        def manifest_cover_node
          if v2?
            id = metadata_node.at("//meta[@name=\"cover\"]")&.content
            rendition_source_node_by_id(id)
            # TODO: Cover can also come from the guide node.
          end
          # V3
          rendition_source_node_by_property("cover-image")
        end
        memoize :manifest_cover_node

        def manifest_cover_node_id
          manifest_cover_node&.attribute("id")&.value
        end
        memoize :manifest_cover_node_id

        def start_section_identifier
          return v2_start_section_identifier if v2?
          return v3_start_section_identifier if v3?

          nil
        end
        memoize :start_section_identifier

        # V2 only
        def guide_node
          rendition_parsed.at("//xmlns:package/xmlns:guide")
        end
        memoize :guide_node

        def rendition_href_to_path(href)
          context.derelativize_ingestion_path(rendition_path, CGI.unescape(href))
        end
        memoize :rendition_href_to_path

        def rel_source_root
          context.rel(context.source_root)
        end

        protected

        def v3_start_section_identifier
          landmarks = toc_inspector.landmarks_structure
          return unless landmarks

          start = landmarks.detect { |l| l[:type] == "bodymatter" }
          return unless start

          href = start[:source_path]
          node = manifest_item_nodes.detect do |n|
            rendition_href_to_path(n.attribute("href").value) == href
          end
          return unless node

          node.attribute("id").value
        end

        def v2_start_section_identifier
          start = v2_guide_node_by_type("text") || v2_guide_node_by_type("start")
          return unless start

          href = rendition_href_to_path(start.attribute("href").value.split("#").first)
          node = manifest_item_nodes.detect do |n|
            rendition_href_to_path(n.attribute("href").value) == href
          end
          return unless node

          node.attribute("id").value
        end

        def manifest_nav_node
          if v2?
            id = spine_node&.attribute("toc")&.value
            rendition_source_node_by_id(id)
          elsif v3?
            rendition_source_node_by_property("nav")
          end
        end

        def spine_node
          rendition_parsed.xpath("//xmlns:package/xmlns:spine")
        end

        def read_rendition_source_by_path(rel_path)
          context.read(File.join(rel_source_root, rel_path))
        end

        def open_rendition_source_by_path(rel_path)
          context.open(File.join(rel_source_root, rel_path))
        end

        def open_rendition_source_by_id(id)
          open_rendition_source_by_path(rendition_source_path_by_id(id))
        end

        def rendition_source_path_by_id(id)
          href = rendition_source_node_by_id(id)&.attribute("href")&.value
          rendition_href_to_path(href)
        end

        def dc
          "http://purl.org/dc/elements/1.1/"
        end

        def opf
          "http://www.idpf.org/2007/opf"
        end

        def rendition_package_node
          rendition_parsed.at("//xmlns:package")
        end

        def rendition_unique_id_node
          id = rendition_package_node_attribute_value("unique-identifier")
          rendition_parsed.at("//*[@id=\"#{id}\"]")
        end

        def rendition_package_node_attribute_value(attr)
          rendition_package_node&.attribute(attr)&.value
        end

        def manifest_node
          rendition_parsed.at("//xmlns:package/xmlns:manifest")
        end

        def container_path
          "/META-INF/container.xml"
        end

        def container_parsed
          xml_parse(container_path)
        end

        def rendition_path
          container_parsed.at("//xmlns:rootfile").attribute("full-path").value
        end

        def rendition_parsed
          xml_parse(rendition_path)
        end

        def xml_parse(rel_path, remove_namespaces: false)
          doc = Nokogiri::XML(context.open(File.join(rel_source_root, rel_path)), nil)
          doc.remove_namespaces! if remove_namespaces
          doc
        end
        # memoize :xml_parse

        def v2_guide_node_by_type(type)
          guide_node&.css("[type=\"#{type}\"]")&.first
        end

      end
    end
  end
end
