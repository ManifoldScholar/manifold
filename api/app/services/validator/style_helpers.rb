module Validator
  module StyleHelpers
    CSS_UNITS = %w(em ex % px cm mm in pt pc ch rem vh vw vmin vmax).freeze

    # @param node [Nokogiri::XML::Node]
    # @return [Hash]
    def read_styles(node)
      style_string_to_hash(read_styles_string(node))
    end

    # @param node [Nokogiri::XML::Node]
    # @return [String]
    def read_styles_string(node)
      node.attributes["style"].try(:value) || ""
    end

    # @param styles [String] an inline CSS string
    # @return [Hash] a hash representation of CSS properties/values
    # rubocop:disable Style/EachWithObject
    def style_string_to_hash(styles)
      return {} if styles.blank?

      styles.split(";").map(&:strip).inject({}) do |out, declaration|
        property, value = declaration.split(":").map(&:strip)
        out[property] = value
        out
      end
    end
    # rubocop:enable Style/EachWithObject

    # @param node [Nokogiri::XML::Node]
    # @param styles [Hash, Array, String] a hash representation of CSS properties/values
    # @return [void]
    def write_styles!(node, styles)
      if styles.respond_to? :each_pair
        node["style"] = pairs_to_style_string(styles)
        return
      end
      if styles.respond_to? :join
        node["style"] = array_to_style_string(styles)
        return
      end
      node["style"] = styles
    end

    # @param styles [Array]
    # @return [String] an inline CSS string
    def array_to_style_string(styles)
      styles.map { |s| s.delete(";") }.join(";")
    end

    # @param styles [Hash] a hash representation of CSS properties/values
    # @return [String] an inline CSS string
    def pairs_to_style_string(styles)
      b = []
      styles.each { |key, value| b.push("#{key}: #{value}") }
      b.join("; ")
    end

    # @param node [Nokogiri::XML::Node]
    # @param property [String] a CSS property
    # @param value [String, Integer] the property value
    # @return [void]
    def set_style(node, property, value)
      styles = read_styles(node)
      styles[property] = value
      write_styles!(node, styles)
    end

    # @param value [String] an attribute value
    # @return [String]
    def unit(value)
      unit = value.downcase.gsub(/\d+/, "")
      return unit if CSS_UNITS.include? unit
    end
  end
end
