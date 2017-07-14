module Ingestor
  module Preprocessor
    module HTML
      class InlineStyles

        include ::Validator::StyleHelpers
        attr_accessor :document, :style_nodes, :map, :count, :parser

        def init_state(markup)
          @document = Nokogiri(markup)
          @style_nodes = document.search("[style]")
          @map = {}
          @count = 0
          @parser = CssParser::Parser.new
        end

        def run(markup)
          init_state(markup)
          style_nodes.each do |node|
            extract_style! node
          end
          insert_style_tag!
          document.to_s
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
          @count = count + 1
          class_name = "extracted-inline-style-#{count}"
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
          head = document.at_css("head")
          styles = css_format(parser.to_s)
          style_node = document.create_element("style", styles, type: "text/css")
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

      end
    end
  end
end
