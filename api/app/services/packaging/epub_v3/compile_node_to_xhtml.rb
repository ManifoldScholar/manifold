module Packaging
  module EpubV3
    # Recursively-runnable interaction to compile a given HTML node into a Nokogiri element,
    # at a certain level.
    #
    # Its primary purpose is to take an {HTMLNodes::Node} that wraps {TextSection#body_json}
    # and insert it into a `<body />` tag.
    #
    # It is intententionally a void interaction, since Nokogiri documents are mutable it
    # changes them in-place.
    #
    # @see Packaging::EpubV3::TextSectionCompilation::BuildInitialHTML
    class CompileNodeToXHTML < ActiveInteraction::Base
      include MonadicInteraction

      object :parent, class: "Nokogiri::XML::Node", default: proc { Nokogiri::HTML.fragment("") }

      object :node, class: "HTMLNodes::Node"

      delegate :document, to: :parent, prefix: true
      delegate :comment?, :element?, :text?, to: :node

      # @see HTMLNodes::Node#attributes_for_epub
      # @return [void]
      def execute
        child = build_child

        return if child.nil?

        node.attributes_for_epub.each do |attribute_name, value|
          child.set_attribute attribute_name, value
        end

        node.children.each do |child_node|
          compose self.class, parent: child, node: child_node
        end

        parent.add_child child
      end

      private

      # @return [Nokogiri::XML::Element, nil]
      def build_child
        return build_element_child if element?
        return build_text_child if text?
      end

      # @return [Nokogiri::XML::Element]
      def build_element_child
        raise "Must be element" unless element?

        Nokogiri::XML::Element.new(node.tag, parent_document)
      end

      # @note For the purposes of styling / connecting annotations in the epub, we wrap
      #   what had been text nodes in `<span />` tags, that are given specific attributes
      # @return [Nokogiri::XML::Element]
      def build_text_child
        raise "Must be text" unless text?

        Nokogiri::XML::Element.new("span", parent_document).tap do |text|
          text.content = node.content
        end
      end
    end
  end
end
