RSpec::Matchers.define :match_serialized_html_node do |expected|

  def build_match_node(node)
    out = {}
    out[:node_type] = node[:node_type] if node.key? :node_type
    out[:tag] = node[:tag] if node.key? :tag
    out[:content] = node[:content] if node.key? :content
    out[:attributes] = node[:attributes] if node.key? :attributes
    if node.key? :children
      children = node[:children].map do |child_node|
        build_match_node(child_node)
      end
      out[:children] = children
    end
    out
  end

  match do |actual|
    adjusted_actual = build_match_node(actual)
    adjusted_actual == expected
  end

  failure_message do |object_instance|
    "expected #{build_match_node(actual)} to equal #{expected} "
  end

  description do
    "Compares serialized HTML nodes without comparing node UUIds"
  end
end
