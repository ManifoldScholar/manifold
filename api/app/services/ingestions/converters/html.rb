module Ingestions
  module Converters
    class HTML < Ingestions::Converters::AbstractConverter
      include Ingestions::Concerns::ConversionHelpers
      include Validator::StyleHelpers

      def perform
        convert_html
      end

      def self.convertible_extensions
        %w(htm html)
      end

      private

      def convert_html
        style_nodes.each do |node|
          extract_style! node
        end
        insert_style_tag!
        ensure_header_ids!
        clean_links!
        document_parsed.to_s
      end

      def parser
        @parser ||= CssParser::Parser.new
      end

      def document_parsed
        @document_parsed ||= Nokogiri::HTML(contents)
      end

      def map
        @map ||= {}
      end

      def style_nodes
        @style_nodes ||= document_parsed.search("[style]")
      end

      def extract_style!(node)
        styles = read_styles_string(node)
        hash = hash(styles)
        add_block(new_class_name(hash), styles) unless mapped?(hash)
        strip_style!(node)
        ensure_class!(node, mapped_class(hash))
      end

      def add_block(class_name, styles)
        block = ".#{class_name} { #{styles} }"
        parser.add_block!(block)
      end

      def new_class_name(hash)
        position = map.values.length
        class_name = "extracted-inline-style-#{position + 1}"
        map[hash] = class_name
      end

      def mapped?(hash)
        map.key? hash
      end

      def mapped_class(hash)
        map[hash]
      end

      def hash(string)
        Digest::SHA1.hexdigest(string)
      end

      def strip_style!(node)
        node.attributes["style"].try(:remove)
      end

      def insert_style_tag!
        head = document_parsed.at_css("head")
        styles = css_format(parser.to_s)
        style_node = document_parsed.create_element("style", styles, type: "text/css")
        head.add_child(style_node)
      end

      def css_format(string)
        out = "\n"
        string.each_line do |line|
          line.strip!
          out << if line.end_with?("{", "}")
                   "  #{line}\n"
                 else
                   "    #{line}\n"
                 end
        end
        out
      end

      def ensure_class!(node, class_name)
        existing_str = node.attributes["class"].try(:value) || ""
        existing = existing_str.split(/\s+/)
        classes = existing.push(class_name).uniq.join(" ")
        node["class"] = classes
      end

      def clean_links!
        document_parsed.css('a[href^="https://www.google.com/url"]').each do |anchor|
          remove_google_url_guard_from! anchor
        end
      end

      def remove_google_url_guard_from!(anchor)
        raw_href = anchor.attr("href")

        query = parse_querystring_in(raw_href)

        return if query.blank? || query["q"].blank?

        anchor["href"] = query["q"].then { |url| CGI.unescape url }
      end

      def parse_querystring_in(url)
        # rubocop:disable Style/RescueModifier
        Rack::Utils.parse_nested_query(URI(url).query) rescue {}
        # rubocop:enable Style/RescueModifier
      end
    end
  end
end
