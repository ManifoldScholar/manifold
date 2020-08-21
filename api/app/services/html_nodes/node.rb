module HTMLNodes
  class Node < Types::FlexibleStruct
    HTML_NODES = Types::Array.of(HTMLNodes::Node).default { [] }.freeze
    ATTRIBUTES = Types::Hash.default { {} }.freeze

    EPUB_TYPE_ATTR = "data-epub-type".freeze

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

    attribute :node_type, Types::ENUM_OF_TYPE[SourceNodeKind]
    attribute? :tag, Types::String
    attribute? :content, Types::String
    attribute? :node_uuid, Types::String
    attribute? :text_digest, Types::String
    attribute? :children, HTML_NODES
    attribute? :node_attributes, ATTRIBUTES

    delegate :comment?, :element?, :text?, to: :node_type

    # @!attribute [r] attributes_for_epub
    # @return [{ String => Object }]
    # rubocop:disable Metrics/AbcSize
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
    # rubocop:enable Metrics/AbcSize

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
  end
end
