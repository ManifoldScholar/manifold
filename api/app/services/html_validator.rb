class HtmlValidator

  def validate(html)
    fragment = Nokogiri::HTML.fragment(html)
    fragment = ensure_one_parent_node(fragment)
    ensure_valid_parent_nodes(fragment)
    return fragment.to_s
  end

  private

  def ensure_valid_parent_nodes(fragment)
    fragment.traverse do |node|
      tag = node.name
      parent_tag = node.parent.try(:name)
      valid = is_tag_valid_with_parent(tag, parent_tag)
      if !valid
        insert_valid_parent(node)
      end
    end
  end

  def ensure_one_parent_node(fragment)
    return fragment if fragment.children.length == 1
    container_fragment = Nokogiri::HTML.fragment("<div></div>")
    container_fragment.first_element_child.children = fragment
    return container_fragment
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
    return validated
  end

  def wrap_node_and_siblings(node, tag)
    index = node.parent.children.index(node)
    parent = node.parent
    node_and_siblings = parent.xpath("#{node.name}")
    node_and_siblings.unlink
    if index == 0
      wrapper = parent.add_child("<#{tag}></#{tag}>").first
      wrapper.children = node_and_siblings
    else
      parent.children[index - 1].after("<#{tag}></#{tag}>")
      parent.children[index].children = node_and_siblings
    end
  end

  def is_tag_valid_with_parent(tag, parent)
    case tag
      when "option"
        return parent == "select" || parent == "optgroup"
      when "optgroup"
        return parent == "select"
      when "tr"
        return parent == "tbody" || parent == "thead" || parent == "tfoot"
      when "th", "td"
        return parent == "tr"
      when "tbody", "thead", "tfoot"
        return parent == "table"
      when "col"
        return parent == "colgroup"
      when "h1", "h2", "h3", "h4", "h5", "h6"
        return parent != 'h1' && parent != 'h2' && parent != 'h3' &&
          parent != 'h4' && parent != 'h5' && parent != 'h6'
    end
    return true
  end

end
