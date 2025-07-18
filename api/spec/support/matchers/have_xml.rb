# frozen_string_literal: true

require 'nokogiri'

RSpec::Matchers.define :have_xml do |xpath, text|
  match do |body|
    @failed_node_text = nil
    doc = Nokogiri::XML::Document.parse(body)
    nodes = doc.xpath(xpath)
    nodes.empty?.should be false
    if text
      @failed_node_text = nodes.find do |node|
        node.content != text
      end
      @failed_node_text.should be_nil
    end
    true
  end

  failure_message do |body|
    return "expected to find xml tag #{xpath} in:\n#{body} but did not" unless @failed_node_text

    "expected xml tag #{xpath} in:\n#{body}\nto have value #{text}, but was #{@failed_node_text.content}"
  end

  failure_message_when_negated do |response|
    return "expected not to find xml tag #{xpath} in:\n#{body}" unless @failed_node_text

    "expected xml tag #{xpath} in:\n#{body}\n not to have value #{text}"
  end

  description do
    "have xml tag #{xpath}"
  end
end
