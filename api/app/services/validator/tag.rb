module Validator
  # Responsible for ensuring that a single tag (a Nokogiri node) is valid
  class Tag

    UNITS = %w(em ex % px cm mm in pt pc ch rem vh vw vmin vmax).freeze

    # @return [void]
    def initialize
      @css_validator = Stylesheet.new
      @config = Rails.configuration.manifold.html_validator
      @tag_validators_map = {
        img: Tags::Img.new
      }
    end

    # Adjusts node attributes according to Manifold validation rules.
    # @param node [Nokogiri::XML::Node]
    # @return [Nokogiri::XML::Node]
    def validate_node!(node)
      apply_tag_validation!(node)
      transform_attributes!(node)
      exclude_attributes!(node)
      validate_inline_css!(node)
    end

    private

    # Normalizes the node name
    # @param node [Nokogiri::XML::Node]
    # @return [String]
    def name_from_node(node)
      node.name.downcase
    end

    # Passes the node to a tag-specific validator, if one exists
    # @param node [Nokogiri::XML::Node]
    # @return [void]
    def apply_tag_validation!(node)
      name = name_from_node(node)
      return unless @tag_validators_map.key?(name)
      @tag_validators_map[name].validate_node!(node)
    end

    # Passes inline CSS to the Stylesheet validator
    # @param node [Nokogiri::XML::Node]
    # @return [void]
    def validate_inline_css!(node)
      styles = read_styles_string(node)
      name = name_from_node(node)
      return if styles.blank?
      valid_styles = @css_validator.validate_declarations(styles, name)
      if valid_styles.empty?
        remove_attribute!(node, "style")
        return
      end
      write_styles!(node, valid_styles)
    end

    # Removes disallowed attributes from node
    # @param node [Nokogiri::XML::Node]
    # @return [void]
    def exclude_attributes!(node)
      exclude = node.attributes.select { |k| @config.attribute_exclusions.include? k }
      exclude.each { |attr_name, _value| remove_attribute!(node, attr_name) }
      nil
    end

    # @param node [Nokogiri::XML::Node]
    # @param attr_name [String]
    # @return [void]
    def remove_attribute!(node, attr_name)
      node.attributes[attr_name].try(:remove)
    end

    # @param node [Nokogiri::XML::Node]
    # @return [void]
    def transform_attributes!(node)
      node.attributes.each { |attribute| transform_attribute!(node, attribute) }
    end

    # @param node [Nokogiri::XML::Node]
    # @param attribute [Array] containing exactly two elements: key and value
    # @return [void]
    def transform_attribute!(node, attribute)
      transforms = @config.attribute_transforms.select { |t| t.name == attribute[0] }
      transforms.each do |transform|
        method = "transform_#{transform.type}!"
        __send__(method, node, attribute, transform)
      end
    rescue NoMethodError => e
      # rubocop:disable LineLength
      Rails.logger.error("Invalid HTML validator transform configuration. Please correct in config/manifold.yml")
      # rubocop:enable LineLength
      Rails.logger.error(e)
    end

    # @param node [Nokogiri::XML::Node]
    # @param attribute [Array] containing exactly two elements: key and value
    # @return [void]
    def transform_max_value!(node, attribute, transform)
      name = attribute_name(attribute)
      value = attribute_value(attribute)
      return unless pixels?(value)
      max = transform[:max]
      return unless strip_unit(value).to_i > max
      node[name] = "#{max}px"
    end

    # @param node [Nokogiri::XML::Node]
    # @param attribute [Array] containing exactly two elements: key and value
    # @return [void]
    def transform_measured_css_map!(node, attribute, transform)
      value = attribute_value(attribute)
      value = "#{value}px" if !unit(value) && pixels?(value)
      property = transform.key?(:to) ? transform[:to] : transform[:name]
      set_style(node, property, value)
    end

    # @param node [Nokogiri::XML::Node]
    # @param attribute [Array] containing exactly two elements: key and value
    # @return [void]
    def transform_css_map!(node, attribute, transform)
      value = attribute_value(attribute)
      property = transform.key?(:to) ? transform[:to] : transform[:name]
      set_style(node, property, value)
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

    # @param attribute [Array] containing exactly two elements: key and value
    # @return [String]
    def attribute_value(attribute)
      attribute[1].value
    end

    # @param attribute [Array] containing exactly two elements: key and value
    # @return [String]
    def attribute_name(attribute)
      attribute[0]
    end

    # @param value [String] an attribute value
    # @return [String]
    def strip_unit(value)
      return "" if value.blank?
      unit = unit(value)
      return value if unit.blank?
      value.gsub(unit, "")
    end

    # @param value [String] an attribute value
    # @return [String]
    def unit(value)
      unit = value.downcase.gsub(/\d+/, "")
      return unit if UNITS.include? unit
    end

    # @param value [String] an attribute value
    # @return [Boolean]
    def pixels?(value)
      unit = unit(value)
      (unit.nil? && value =~ /^[0-9]+$/) || unit == "px"
    end

    # @param node [Nokogiri::XML::Node]
    # @return [String]
    def read_styles_string(node)
      node.attributes["style"].try(:value) || ""
    end

    # @param node [Nokogiri::XML::Node]
    # @return [Hash]
    def read_styles(node)
      style_string_to_hash(read_styles_string(node))
    end

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

  end
end
