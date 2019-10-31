module HTMLNodes
  class NamespaceSet < Types::FlexibleStruct
    attribute :epub_prefixes, Types::Array.of(HTMLNodes::EpubPrefix).default { [] }
    attribute :namespaces, Types::Array.of(HTMLNodes::Namespace).default { [] }

    # @param [HTMLNodes::NamespaceSet] other
    # @return [HTMLNodes::NamespaceSet]
    def |(other)
      merged = attributes.merge other.attributes do |key, a, b|
        case key
        when :epub_prefixes, :namespaces then a | b
        else
          b
        end
      end

      self.class.new merged
    end

    def has_epub_prefixes?
      epub_prefixes.any?
    end

    # @return [{ String => String }]
    def to_nokogiri
      to_namespace_hash.merge(to_prefix_hash)
    end

    private

    # @return [{ String => String }]
    def to_namespace_hash
      namespaces.each_with_object(initial_namespaces) do |ns, h|
        h[ns.name] = ns.url.to_s
      end
    end

    # @return [{ String => String }]
    def to_prefix_hash
      {}.tap do |h|
        h["epub:prefix"] = epub_prefixes.map(&:to_s).join(", ") if has_epub_prefixes?
      end
    end

    def initial_namespaces
      { "xmlns" => "http://www.w3.org/1999/xhtml" }
    end
  end
end
