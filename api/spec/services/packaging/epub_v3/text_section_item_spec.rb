# frozen_string_literal: true

RSpec.describe Packaging::EpubV3::TextSectionItem do
  let_it_be(:text, refind: true) { FactoryBot.create :text }
  let_it_be(:text_section, refind: true) { FactoryBot.create(:text_section, text: text) }
  let_it_be(:simple_div) do
    HTMLNodes::Node.new(
      node_type: "element",
      tag: "div",
      children: [{ node_type: "text", content: "This is Content " }],
    )
  end

  let_it_be(:epub_div) do
    HTMLNodes::Node.new(
      node_type: "element",
      tag: "div",
      children: [{ node_type: "text", content: "This is Content " }],
      attributes: { "data-epub-type" => "aside" }
    )
  end

  let_it_be(:namespace_set) { HTMLNodes::NamespaceSet.new }

  let_it_be(:node) do
    simple_div
  end

  let_it_be(:document) do
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

  let!(:text_section_item) do
    described_class.new(
      document: document,
      namespace_set: namespace_set,
      node: node,
      referenced_items: [],
      remote_resources: [],
      text_section: text_section,
      stylesheets: [],
    )
  end

  subject { text_section_item }

  context "with a text section with no ingestion" do
    let_it_be(:text_section, refind: true) { FactoryBot.create :text_section, ingestion_source: nil }

    it { is_expected.not_to have_remote_resources }

    context "when the node is a regular node" do
      let_it_be(:node) do
        simple_div
      end

      it { is_expected.not_to have_landmark }
    end

    context "when the node has an epub type" do
      let_it_be(:node) do
        epub_div
      end

      it "generates a default landmark" do
        is_expected.to have_landmark
      end
    end
  end
end
