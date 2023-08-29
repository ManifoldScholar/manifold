require "cgi"

module Ingestions
  module PreProcessors
    class ExtractStylesheets < AbstractInteraction
      hash :manifest, strip: false

      def execute
        manifest[:relationships][:stylesheets] = []

        update_text_sections

        mapped_style_nodes.each do |node|
          stylesheet = build_stylesheet(node)
          manifest[:relationships][:stylesheets] << stylesheet if stylesheet.present?
        end

        manifest
      end

      private

      def build_stylesheet(node)
        content = hashed_content(node)
        return if stylesheet_exists?(content)

        position = stylesheets.count + 1
        stylesheet_name = name(node, content)

        {}.with_indifferent_access.tap do |hash|
          hash[:name] = stylesheet_name
          hash[:position] = position
          hash[:hashed_content] = content
          hash[:build] = write_file(stylesheet_name, node)
          hash[:source_identifier] = source_identifier(node)
        end
      end

      def build_source_map
        {}.with_indifferent_access.tap do |hash|
          text_section_attributes.each do |section|
            ingestion_source = ingestion_source_for_section(section)
            nodes = style_nodes_for_section(section)

            next unless ingestion_source.present? && nodes.present?

            hash[ingestion_source[:source_path]] = unique_style_nodes(nodes)
          end
        end
      end

      def update_text_sections
        text_section_attributes.each do |section|
          nodes = style_nodes_for_section(section)
          section[:stylesheet_contents] = []

          nodes.map { |node| section[:stylesheet_contents] << hashed_content(node) }
        end
      end

      def text_section_attributes
        @text_section_attributes ||= manifest[:relationships][:text_sections]
      end

      def source_map
        @source_map ||= build_source_map
      end

      def stylesheets
        @stylesheets ||= manifest[:relationships][:stylesheets]
      end

      def section_parsed(path)
        Nokogiri::HTML(context.read(path), nil)
      end

      def source_identifier(node)
        node&.attribute("href")&.value
      end

      def hashed_content(node)
        Digest::MD5.hexdigest(raw_styles(node))
      end

      def name(node, content)
        external?(node) ? "stylesheet-#{content}" : "head-#{content}"
      end

      def mapped_style_nodes
        unique_style_nodes source_map.values.flatten
      end

      def raw_styles(node)
        return node.content unless external?(node)

        context.read(source_path_for_file(node))
      end

      def style_nodes_for_section(section)
        xpath = "//*[@rel=\"stylesheet\" or @media=\"all\" or @media=\"screen\"] |
                    //style"

        section_parsed(section["build"]).search(xpath).to_ary
      end

      def unique_style_nodes(nodes)
        nodes.uniq do |parsed|
          case parsed.name
          when "link"
            parsed.attributes["href"]&.value
          when "style"
            parsed.text.squish
          else
            false
          end
        end
      end

      def external?(node)
        return true if node.name == "link"
        return false if node.name == "style"

        raise IngestionError, "Invalid style chunk"
      end

      def stylesheet_exists?(hashed_content)
        stylesheets.detect do |stylesheet|
          stylesheet[:hashed_content] == hashed_content
        end
      end

      def write_file(name, node)
        context.write_build_file "#{name}.css",
                                 raw_styles(node)
      end

      def source_path_for_file(node)
        file = source_identifier(node)
        source_path = ingestion_source_path(node)
        return unless source_path.present?

        path = if Pathname.new(file).absolute?
                 file
               else
                 context.derelativize_ingestion_path source_path, file
               end

        CGI.unescape File.join(context.rel(context.source_root), path)
      end

      def ingestion_source_path(node)
        source_map.detect do |key, nodes|
          break key if nodes.any? do |source_node|
            source_node.attributes["href"]&.value == node.attributes["href"]&.value
          end
        end
      end

      def ingestion_source_for_section(section)
        manifest[:relationships][:ingestion_sources].detect do |ingestion_source|
          ingestion_source[:source_identifier] == section[:source_identifier]
        end
      end

    end
  end
end
