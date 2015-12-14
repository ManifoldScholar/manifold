class HtmlSerializer

  ELEMENT_BLACK_LIST = %w(script)
  INLINE_ELEMENTS = %w(b big i small tt abbr acronym cite code dfn em kbd strong samp time
                       var a bdo br img map object q script span sub sup button input
                       label select textarea)

  def serialize(html)
    reset()
    return if html.blank?
    fragment = Nokogiri::HTML.fragment(HtmlValidator.new.validate(html))
    node = fragment.children.first
    output = visit(node)
    return output
  end

  protected

  def visit(node)
    representation = {}
    visited = beginVisit(node, representation)
    return nil if !visited
    children = traverse(node)
    representation[:children] = children unless children.nil?
    clean_empty_text_nodes!(representation)
    return representation
  end

  def is_block_level_element(representation)
    representation[:node_type] == "element" && !INLINE_ELEMENTS.include?(representation[:tag])
  end

  def clean_empty_text_nodes!(representation)
    return unless representation[:node_type] == "element"
    return if !is_block_level_element(representation)
    return if !representation[:children] || representation[:children].length == 0
    # Node is a block level element with children
    representation[:children].each_with_index do |child, index|
      next if child[:node_type] != "text"
      next unless child[:content].blank?
      child[:delete] = true if index == 0
      child[:delete] = true if (index + 1) == representation[:children].length
      # Between two block level elements
      if representation[:children][index - 1] &&
        is_block_level_element(representation[:children][index - 1]) &&
        representation[:children][index + 1] &&
        is_block_level_element(representation[:children][index + 1])
        representation[:children][index][:delete] = true
      end
    end
    representation[:children] = representation[:children].reject { |child| child[:delete] == true }
  end

  def traverse(node)
    children = nil
    node.children.each do |child_node|
      children ||= []
      representation = visit(child_node)
      children.push(representation) unless representation.nil?
    end
    children
  end

  def beginVisit(node, representation)
    return beginVisitElement(node, representation) if node.element?
    return beginVisitComment(node, representation) if node.comment?
    return beginVisitText(node, representation) if node.text?
    return false
  end

  def beginVisitElement(node, representation)
    return false if ELEMENT_BLACK_LIST.include?(node.name.downcase)
    representation[:node_type] = "element"
    representation[:tag] = node.name
    representation[:attributes] = node.attributes
                                    .transform_keys { |k| k.to_sym }
                                    .transform_values { |v| v.content }
    true
  end

  def beginVisitComment(node, representation)
    representation[:node_type] = "comment"
    representation[:content] = node.content
    true
  end

  def beginVisitText(node, representation)
    representation[:node_type] = "text"
    representation[:content] = node.content
    true
  end

  def reset
    @parentNode = nil
    @currentNode = nil
    @level = 0
    @path = []
  end

end
