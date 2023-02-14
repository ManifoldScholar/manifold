module Validator
  # This class takes an HTML string input and validates it. In doing so, it will parse the
  # HTML and transform it into a valid HTML structure that can be consumed by the Manifold
  # frontend. This mainly involves insuring proper nesting, and making sure that the
  # structure will work with ReactDom.
  class HTML

    VOID_ELEMENTS = %w(area base br col embed hr img input keygen
                       link meta param source track wbr).freeze

    def validate(html)
      source = html.encoding == ::Encoding::ASCII_8BIT ? html.encode("UTF-8") : html
      fragment = Nokogiri::HTML.fragment(source)
      fragment = ensure_one_parent_node(fragment)
      ensure_valid_parent_nodes(fragment)
      strip_invalid_children(fragment)
      validate_tags(fragment)
      close_void_tags(fragment.to_s)
    end

    private

    def close_void_tags(html)
      output = html
      VOID_ELEMENTS.each do |element|
        output.gsub!(%r(<#{element}(.*?)?/?>), "<#{element}\\1 />")
        output.gsub!(%r(</#{element}>), "")
      end

      output
    end

    def validate_tags(fragment)
      tag_validator = Validator::Tag.new
      fragment.traverse do |node|
        tag_validator.validate_node!(node)
      end
    end

    def strip_invalid_children(fragment)
      fragment.traverse do |node|
        strip = false
        tag = node.name
        ancestors = []
        node.ancestors.each { |n| ancestors.push(n.name) }
        if tag == "p"
          strip = true if ancestors.include?("p")
        end
        node.remove if strip
      end
    end

    def ensure_valid_parent_nodes(fragment)
      fragment.traverse do |node|
        tag = node.name
        parent_tag = node.parent.try(:name)
        valid = tag_valid_with_parent?(tag, parent_tag)
        insert_valid_parent(node) unless valid
      end
    end

    def ensure_one_parent_node(fragment)
      return fragment if fragment.children.length == 1

      container_fragment = Nokogiri::HTML.fragment("<div></div>")
      container_fragment.first_element_child.children = fragment
      container_fragment
    end

    def insert_valid_parent(node)
      tag = node.name
      validated = false
      case tag
      when "tr"
        wrap_node_and_siblings(node, "tbody")
      when "option"
        wrap_node_and_siblings(node, "select")
      end
      validated
    end

    def wrap_node_and_siblings(node, tag)
      index = node.parent.children.index(node)
      parent = node.parent
      node_and_siblings = parent.xpath(node.name.to_s)
      node_and_siblings.unlink
      if index.zero?
        wrapper = parent.add_child("<#{tag}></#{tag}>").first
        wrapper.children = node_and_siblings
      else
        parent.children[index - 1].after("<#{tag}></#{tag}>")
        parent.children[index].children = node_and_siblings
      end
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/CyclomaticComplexity
    def tag_valid_with_parent?(tag, parent)
      case tag
      when "option"
        return %w(select optgroup).include? parent
      when "optgroup"
        return parent == "select"
      when "tr"
        return %w(tbody thead tfoot).include? parent
      when "th", "td"
        return parent == "tr"
      when "tbody", "thead", "tfoot"
        return parent == "table"
      when "col"
        return parent == "colgroup"
      when "h1", "h2", "h3", "h4", "h5", "h6"
        return %w(h1 h2 h3 h4 h5 h6).exclude? parent
      end
      true
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/CyclomaticComplexity
  end
end
