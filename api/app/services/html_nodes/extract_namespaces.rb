module HTMLNodes
  class ExtractNamespaces < ActiveInteraction::Base
    EPUB_PREFIX = /\A(?<name>[^:]+):\s+(?<url>.+)\z/.freeze
    PREFIX_SEPARATOR = /,\s*(?=\S+:)/.freeze

    object :document, class: "Nokogiri::XML::Document"

    # @return [HTMLNodes::NamespaceSet]
    def execute
      @params = { namespaces: [], epub_prefixes: [] }

      extract_from_html!

      HTMLNodes::NamespaceSet.new @params
    end

    private

    # @return [void]
    def extract_from_html!
      html_node = document.at_css "html"

      return unless html_node

      html_node.attributes.each_value do |attr|
        case attr.name
        when "epub:prefix"
          @params[:epub_prefixes] = parse_epub_prefixes attr.value
        else
          @params[:namespaces] << extract_namespace_from(attr)
        end
      end

      @params.transform_values! &:compact
    end

    # @param [Nokogiri::XML::Attr] attr
    # @return [Hash, nil]
    def extract_namespace_from(attr)
      is_url = Types::HTTP_URI.try(attr.value)

      return nil unless is_url.success?

      { name: attr.name, url: is_url.input }
    end

    def parse_epub_prefixes(value)
      value.split(PREFIX_SEPARATOR).map do |pair|
        match = pair.match EPUB_PREFIX

        next nil unless match

        match.names.zip(match.captures).to_h.symbolize_keys
      end
    end
  end
end
