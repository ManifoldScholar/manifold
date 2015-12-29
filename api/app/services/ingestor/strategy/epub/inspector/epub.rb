require "fileutils"
require "zip"
require "memoist"
require "uri"
require "open-uri"

module Ingestor
  module Strategy
    module EPUB
      module Inspector
        # Inspects the EPUB document and provides high level information and access to
        # document structure, nodes, etc.
        #
        # @author Zach Davis
        # rubocop: disable Metrics/ClassLength
        class EPUB
          extend Memoist
          include Ingestor::Loggable
          attr_reader :logger

          def initialize(epub_path, logger = nil)
            @epub_path = epub_path
            @logger = logger
          end

          def log(level, msg)
            @logger.send(level, msg) if @logger
          end

          def epub_basename
            File.basename(@epub_path)
          end
          memoize :epub_basename

          def v3?
            epub_version.starts_with?("3")
          end

          def v2?
            epub_version.starts_with?("2")
          end

          def epub_extension
            File.extname(epub_basename).split(".").last
          end
          memoize :epub_extension

          def container_zip_entry
            container_zip_entry = nil
            Zip::File.open(@epub_path) do |zip_file|
              container_zip_entry = zip_file.glob("META-INF/container.xml").first
            end
            container_zip_entry
          end
          memoize :container_zip_entry

          def container_file_contents
            container_zip_entry.get_input_stream.read
          end
          memoize :container_file_contents

          def container_xml
            Nokogiri::XML(container_file_contents)
          end
          memoize :container_xml

          def rendition_relative_path
            container_xml.xpath("//xmlns:rootfile").first.attribute("full-path").value
          end
          memoize :rendition_relative_path

          def rendition_zip_entry
            rendition_zip_entry = nil
            Zip::File.open(@epub_path) do |zip_file|
              rendition_zip_entry = zip_file.glob(rendition_relative_path).first
            end
            rendition_zip_entry
          end
          memoize :rendition_zip_entry

          def rendition_file_contents
            rendition_zip_entry.get_input_stream.read
          end
          memoize :rendition_file_contents

          def rendition_xml
            Nokogiri::XML(rendition_file_contents)
          end
          memoize :rendition_xml

          def epub_version
            rendition_xml.xpath("//xmlns:package").first.attribute("version").value
          end
          memoize :epub_version

          def unique_id
            id_id = rendition_xml.xpath("//xmlns:package")
                    .attribute("unique-identifier").value
            rendition_xml.css("##{id_id}").first.text
          end
          memoize :unique_id

          def metadata_node
            rendition_xml.xpath("//xmlns:package/xmlns:metadata")
          end
          memoize :metadata_node

          def manifest_node
            rendition_xml.xpath("//xmlns:package/xmlns:manifest")
          end
          memoize :manifest_node

          def spine_node
            rendition_xml.xpath("//xmlns:package/xmlns:spine")
          end
          memoize :spine_node

          # V2 only
          def guide_node
            rendition_xml.xpath("//xmlns:package/xmlns:guide")
          end

          def title_nodes
            metadata_node.xpath("//dc:title", "dc" => dc)
          end
          memoize :title_nodes

          def creator_nodes
            metadata_node.xpath("//dc:creator", "dc" => dc)
          end
          memoize :creator_nodes

          def contributor_nodes
            metadata_node.xpath("//dc:contributor", "dc" => dc)
          end
          memoize :contributor_nodes

          def language_node
            metadata_node.xpath("//dc:language", "dc" => dc)
          end
          memoize :language_node

          def date_node
            metadata_node.xpath("//dc:date", "dc" => dc)
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
            manifest_node.xpath("//xmlns:item")
          end
          memoize :manifest_item_nodes

          def manifest_nav_item
            if v2?
              toc_id = spine_node.attribute("toc")
              manifest_node.at_xpath('//*[@id="' + toc_id + '"]')
            elsif v3?
              manifest_node.at_xpath(('//*[contains(@properties, "nav")]'))
            end
          end
          memoize :manifest_nav_item

          def manifest_cover_item
            manifest_node.xpath('//*[contains(@properties, "cover-image")]').first
          end
          memoize :manifest_cover_item

          def manifest_cover_item_id
            node = manifest_cover_item
            return unless node
            meta_cover_node = metadata_node.css('[name="cover"]').first
            return unless meta_cover_node
            id = meta_cover_node.attribute("content")
            cover_node = rendition_source_node_by_id(id)
            return unless cover_node
            attr = cover_node.attribute("id")
            attr.to_str
          end
          memoize :manifest_cover_item_id

          def nav_path
            node = manifest_nav_item
            if node
              local_path = node.attribute("href")
              return local_path
            else
              Raise "Unable to find nav document in manifest"
            end
          end

          def nav_xml_with_ns
            node = manifest_nav_item
            return unless node
            local_path = node.attribute("href")
            Nokogiri::XML(get_rendition_source(local_path))
          end
          memoize :nav_xml_with_ns

          def nav_xml
            nav_xml_with_ns.remove_namespaces!
          end
          memoize :nav_xml

          def spine_item_nodes
            spine_node.xpath("//xmlns:itemref")
          end
          memoize :spine_item_nodes

          def read_rendition_source(relative_path)
            uri = URI(relative_path)
            if uri.absolute?
              debug "services.ingestor.strategy.ePUB.log.download_external",
                    relative_path: relative_path
              return nil
            end
            debug "services.ingestor.strategy.ePUB.log.extract_local_resource",
                  relative_path: relative_path
            Zip::File.open(@epub_path) do |zip_file|
              return zip_file
                .glob(source_zip_path(relative_path)).first.get_input_stream.read
            end
          end
          memoize :read_rendition_source

          def spine_item_xml(source_id)
            doc = Nokogiri::XML(get_rendition_source_by_id(source_id))
            doc.remove_namespaces!
            doc
          end

          def rendition_source_node_by_id(source_id)
            xpath = "//*[@id='#{source_id}']"
            manifest_item_nodes.xpath(xpath)
          end

          def get_rendition_source_by_id(source_id)
            debug "services.ingestor.strategy.ePUB.log.get_rendition_source",
                  source_id: source_id
            node = rendition_source_node_by_id(source_id)
            path = node.attribute("href")
            get_rendition_source(path)
          end

          def get_rendition_source(relative_path)
            # This warrants explanation. We stream the file contents from the zip, then
            # we convert it to StringIO, which mostly acts like a file. However, we need
            # to add some additional info for paperclip, and rather than monkey patch
            # String IO, we just add some methods to the instance.
            # See http://stackoverflow.com/questions/5166782/write-stream-to-paperclip
            string_contents = read_rendition_source(relative_path)
            return nil unless string_contents
            file = StringIO.new(string_contents)
            filename = File.basename(relative_path)
            metaclass = class << file; self; end
            metaclass.class_eval do
              define_method(:original_filename) { filename }
              define_method(:content_type) { "" }
            end
            file
          end
          memoize :get_rendition_source

          def toc_inspector
            return TOC.new(self) if nav_xml
            Naught.build
          end

          private

          def dc
            "http://purl.org/dc/elements/1.1/"
          end

          def source_zip_path(relative_path)
            [File.dirname(rendition_relative_path), relative_path].join("/")
          end
        end
      end
    end
  end
end
