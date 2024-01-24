# frozen_string_literal: true

require "rails_helper"

RSpec.describe Packaging::EpubV3::CompileNodeToXHTML, interaction: true do
  let(:document) do
    Nokogiri::HTML(<<~HTML)
    <!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:xml="http://www.w3.org/XML/1998/namespace" xmlns:epub="http://www.idpf.org/2007/ops" epub:prefix="z3998: http://www.daisy.org/z3998/2012/vocab/structure/#, se: https://standardebooks.org/vocab/1.0">
      <head>
        <title></title>
      </head>
      <body class="manifold-text-section">
      </body>
    </html>
    HTML
  end

  let_input!(:parent) { document.at_css("body") }

  context "when provided an empty node" do
    let_input!(:node) { HTMLNodes::Node.new }

    it "handles it appropriately" do
      expect do
        perform_within_expectation!
      end.to keep_the_same { parent.children.size }
    end
  end

  context "when provided a nested node" do
    let_it_be(:simple_node_tree) do
      {
        "node_uuid" => "A",
        "tag" => "section",
        "node_type" => "element",
        "children" => [
          {
            "node_uuid" => "B",
            "tag" => "p",
            "node_type" => "element",
            "children" => [
              {
                "node_uuid" => "C",
                "node_type" => "text",
                "content" => "This is a sentence with"
              },
              {
                "node_uuid" => "D",
                "tag" => "i",
                "node_type" => "element",
                "children" => [
                  {
                    "node_uuid" => "E",
                    "node_type" => "text",
                    "content" => "italic text"
                  }
                ]
              },
              {
                "node_uuid" => "F",
                "node_type" => "text",
                "content" => "followed by regular text"
              }
            ]
          },
          {
            "node_uuid" => "G",
            "tag" => "p",
            "node_type" => "element",
            "children" => [
              {
                "node_uuid" => "H",
                "node_type" => "text",
                "content" => "And another sentence"
              }
            ]
          }
        ]
      }
    end

    let_input!(:node) do
      HTMLNodes::Node.new(simple_node_tree)
    end

    it "adds the node and its children to the document" do
      expect do
        perform_within_expectation!
      end.to change { parent.children.size }.by(1)
    end
  end
end
