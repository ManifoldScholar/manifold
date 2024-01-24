# frozen_string_literal: true

module HTMLNodes
  class Node < Types::FlexibleStruct
    include Enumerable

    HTML_NODES = Types::Array.of(HTMLNodes::Node).default { [] }.freeze
    ATTRIBUTES = Types::Hash.default { {} }.freeze

    EPUB_TYPE_ATTR = "data-epub-type"

    ATTRIBUTES_TO_COPY = [
      [EPUB_TYPE_ATTR, "epub:type"],
      ["data-xml-lang", "xml:lang"]
    ].freeze

    transform_keys do |key|
      case key
      when /\Aattributes\z/ then :node_attributes
      else
        key.to_sym
      end
    end

    attribute? :node_type, SourceNodeKind.dry_type
    attribute? :tag, Types::String
    attribute? :content, Types::String
    attribute? :node_uuid, Types::String
    attribute? :text_digest, Types::String
    attribute? :children, HTML_NODES
    attribute? :node_attributes, ATTRIBUTES

    delegate :comment?, :element?, :text?, :unknown?, to: :node_type

    # @!attribute [r] attributes_for_epub
    # @return [{ String => Object }]
    memoize def attributes_for_epub
      if element?
        {}.merge(node_attributes).tap do |h|
          ATTRIBUTES_TO_COPY.each do |(source, target)|
            h[target] = h[source] if h[source].present?
          end
        end
      elsif text?
        {}.tap do |h|
          h["data-node-type"] = "text"
          h["data-node-uuid"] = node_uuid
          h["data-text-digest"] = text_digest
        end
      else
        {}
      end
    end
    # @!attribute [r] epub_type
    # @return [String]
    memoize def epub_type
      node_attributes&.[](EPUB_TYPE_ATTR)
    end

    def has_children?
      children.present?
    end

    def has_epub_type?
      epub_type.present?
    end

    def has_tag?(name)
      tag == name.to_s
    end

    def each
      return enum_for(__method__) unless block_given?

      children.each do |child|
        yield child
      end
    end

    def with_paths(path: [], parent: nil)
      each_with_index.reduce [{ path: path, node: self, parent: parent }] do |acc, (child, index)|
        new_path = [*path, "children", index]

        acc + child.with_paths(path: new_path, parent: self)
      end
    end
  end
end
