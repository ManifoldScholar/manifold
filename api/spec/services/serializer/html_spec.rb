require "rails_helper"

# rubocop:disable Layout/LineLength
RSpec.describe Serializer::HTML do
  let(:serializer) { Serializer::HTML.new }

  it "should wrap top level siblings in a div element" do
    node = "<p>AAA</p><p>BBB</p>"
    object = {
      node_type: "element", tag: "div", attributes: {},
      children: [
        { node_type: "element", tag: "p", attributes: {}, children: [{ node_type: "text", content: "AAA" }] },
        { node_type: "element", tag: "p", attributes: {}, children: [{ node_type: "text", content: "BBB" }] }
      ]
    }
    expect(serializer.serialize(node)).to match_serialized_html_node(object)
  end

  it "should skip a node it cant handle" do
    node = "<div>AAA<![CDATA[BBB]]></div>"
    object = {
      node_type: "element", tag: "div", attributes: {},
      children: [
        { node_type: "text", content: "AAA" }
      ]
    }
    expect(serializer.serialize(node)).to match_serialized_html_node(object)
  end

  it "should skip a blacklisted element" do
    node = "<div>AAA<script type=\"text/javascript\">alert('test');</script>BBB</div>"
    object = {
      node_type: "element", tag: "div", attributes: {},
      children: [
        { node_type: "text", content: "AAA" },
        { node_type: "text", content: "BBB" }
      ]
    }
    expect(serializer.serialize(node)).to match_serialized_html_node(object)
  end

  it "should convert a simple HTML node into a JSON object" do
    node = "<div>AAA</div>"
    object = {
      node_type: "element", tag: "div", attributes: {},
      children: [
        { node_type: "text", content: "AAA" }
      ]
    }
    expect(serializer.serialize(node)).to match_serialized_html_node(object)
  end

  it "should extract element attributes" do
    node = "<div class=\"AAA\"></div>"
    object = {
      node_type: "element", tag: "div", attributes: { class: "AAA" }
    }
    expect(serializer.serialize(node)).to match_serialized_html_node(object)
  end

  it "should extract comment node content" do
    node = "<div>AAA<!--BBB-->CCC</div>"
    object = {
      node_type: "element", tag: "div", attributes: {}, children: [
        { node_type: "text", content: "AAA" },
        { node_type: "comment", content: "BBB" },
        { node_type: "text", content: "CCC" }
      ]
    }
    expect(serializer.serialize(node)).to match_serialized_html_node(object)
  end

  it "should correctly handle an element inside a text node" do
    node = "<div>AAA<span>BBB</span>CCC</div>"
    object = {
      node_type: "element", tag: "div", attributes: {}, children: [
        { node_type: "text", content: "AAA" },
        { node_type: "element", tag: "span", attributes: {}, children: [
          { node_type: "text", content: "BBB" }
        ] },
        { node_type: "text", content: "CCC" }
      ]
    }
    expect(serializer.serialize(node)).to match_serialized_html_node(object)
  end

  it "should not add a node_uuid to element nodes" do
    html = "<div><span>AAA</span></div>"
    serialized = serializer.serialize(html)
    span_node = serialized[:children].first
    expect(span_node).to_not include(:node_uuid)
  end

  it "should add a node_uuid to text nodes" do
    html = "<div><span>AAA</span></div>"
    serialized = serializer.serialize(html)
    span_node = serialized[:children].first
    text_node = span_node[:children].first
    expect(text_node).to include(:node_uuid)
  end

  it "should merge mathml only child text nodes into the parent element" do
    html = "<math><mn>20</mn></math>"
    serialized = serializer.serialize(html)
    mn_node = serialized[:children].first
    expect(mn_node).to include(:node_uuid)
    expect(mn_node).to include(:content)
    expect(mn_node).to include(:tag)
  end

  it "should remove all blank nodes from mathml" do
    html = "<math>\n<mn>20</mn>\n</math>"
    serialized = serializer.serialize(html)
    children = serialized[:children]
    expect(children.size).to eq 1
  end


end
