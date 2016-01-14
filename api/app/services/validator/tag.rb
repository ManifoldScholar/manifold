module Validator
  # Responsible for ensuring that a single tag (a Nokogiri node) is valid
  class Tag
    include Mixins::Css::StyleString

    def initialize
      @map = {
        img: Tags::Img.new
      }
    end

    def validate_node!(node)
      apply_tag_validation!(node)
      cap_attribute_value!(node, "width", Validator::Constants::MAX_WIDTH)
      convert_attribute_to_style!(node, "color", "color")
      convert_attribute_to_style!(node, "bgcolor", "background-color")
      convert_attribute_to_style!(node, "align", "text-align")
      convert_measured_attribute_to_style!(node, "border", "border")
      convert_measured_attribute_to_style!(node, "width", "max-width")
      remove_blacklisted_attributes!(node)
      remove_blacklisted_css_properties!(node)
    end

    private

    def css_property_blacklist_for_node(node)
      blacklist = Validator::Constants::CSS_PROPERTY_BLACKLIST
      tag_constant = "TAG_#{node.name.upcase}_CSS_PROPERTY_BLACKLIST"
      if Validator::Constants.const_defined?(tag_constant)
        blacklist |= Validator::Constants.const_get(tag_constant)
      end
      blacklist
    end

    def node_style_hash(node)
      start_style = node.attributes["style"].try(:value) || ""
      style_string_to_hash(start_style)
    end

    def remove_blacklisted_css_properties!(node)
      return unless node.attributes["style"]
      clean_hash = node_style_hash(node).except!(*css_property_blacklist_for_node(node))
      if clean_hash.keys.length == 0
        node.attributes["style"].try(:remove)
        return
      end
      node["style"] = hash_to_style_string(clean_hash)
    end

    def cap_attribute_value!(node, attr, max)
      attr_value = node.attributes[attr].try(:value).try(:to_i)
      return unless attr_value && attr_value > max
      node[attr] = max
    end

    def remove_blacklisted_attributes!(node)
      Validator::Constants::TAG_ATTRIBUTE_BLACKLIST.each do |attr|
        node.attributes[attr] || next
        node.attributes[attr].remove
      end
    end

    def convert_attribute_to_style!(node, attr_name, property_name, value = nil)
      attr_value = value || node.attributes[attr_name].try(:value)
      return if attr_value.nil?
      start_style = node.attributes["style"].try(:value) || ""
      start_style_hash = style_string_to_hash(start_style)
      start_style_hash[property_name] = attr_value
      node["style"] = hash_to_style_string(start_style_hash)
    end

    def convert_measured_attribute_to_style!(node, attr_name, property_name)
      attr_value = node.attributes[attr_name].try(:value)
      return if attr_value.nil?
      value = to_css_value_and_unit(attr_value)
      convert_attribute_to_style!(node, attr_name, property_name, value)
    end

    def remove_attribute(node, attr_name)
      node.attributes[attr_name].try(:remove)
    end

    def apply_tag_validation!(node)
      name = node.name.downcase
      return unless @map.key?(name)
      @map[name].validate_node!(node)
    end
  end
end
