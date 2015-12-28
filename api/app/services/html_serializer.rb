# This class takes HTML input and serializes it into a deeply nested object, which will
# likely then be transformed into JSON. The Manifold React frontend can then traverse this
# structure and create React components on the fly.
class HtmlSerializer
  ELEMENT_BLACK_LIST = %w(script)
  INLINE_ELEMENTS = %w(b big i small tt abbr acronym cite code dfn em kbd strong samp time
                       var a bdo br img map object q script span sub sup button input
                       label select textarea)

  def serialize(html)
    reset
    return if html.blank?
    fragment = Nokogiri::HTML.fragment(HtmlValidator.new.validate(html))
    node = fragment.children.first
    output = visit(node)
    output
  end

  protected

  def visit(node)
    representation = {}
    visited = begin_visit(node, representation)
    return nil unless visited
    children = traverse(node)
    representation[:children] = children unless children.nil?
    clean_empty_text_nodes!(representation)
    representation
  end

  def block_level_element?(representation)
    representation[:node_type] == "element" &&
      !INLINE_ELEMENTS.include?(representation[:tag])
  end

  # rubocop:disable Metrics/PerceivedComplexity, Metrics/MethodLength, Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  def clean_empty_text_nodes!(representation)
    return unless representation[:node_type] == "element"
    return unless block_level_element?(representation)
    return if !representation[:children] || representation[:children].length == 0
    # Node is a block level element with children
    representation[:children].each_with_index do |child, index|
      next if child[:node_type] != "text"
      next unless child[:content].blank?
      child[:delete] = true if index == 0
      child[:delete] = true if (index + 1) == representation[:children].length
      # Between two block level elements
      next unless representation[:children][index - 1] &&
                  block_level_element?(representation[:children][index - 1]) &&
                  representation[:children][index + 1] &&
                  block_level_element?(representation[:children][index + 1])
      representation[:children][index][:delete] = true
    end
    representation[:children] = representation[:children].reject do |child|
      child[:delete] == true

    end
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

  def begin_visit(node, representation)
    return begin_visit_element(node, representation) if node.element?
    return begin_visit_comment(node, representation) if node.comment?
    return begin_visit_text(node, representation) if node.text?
    false
  end

  def begin_visit_element(node, representation)
    return false if ELEMENT_BLACK_LIST.include?(node.name.downcase)
    representation[:node_type] = "element"
    representation[:tag] = node.name
    representation[:attributes] = node.attributes
                                  .transform_keys(&:to_sym)
                                  .transform_values(&:content)
    true
  end

  def begin_visit_comment(node, representation)
    representation[:node_type] = "comment"
    representation[:content] = node.content
    true
  end

  def begin_visit_text(node, representation)
    representation[:node_type] = "text"
    representation[:content] = node.content
    true
  end

  def reset
    @parent_node = nil
    @current_node = nil
    @level = 0
    @path = []
  end
end
