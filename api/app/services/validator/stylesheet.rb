require "memoist"

module Validator
  # This class takes an HTML string input and validates it. In doing so, it will parse the
  # HTML and transform it into a valid HTML structure that can be consumed by the Manifold
  # frontend. This mainly involves insuring proper nesting, and making sure that the
  # structure will work with ReactDom.
  class Stylesheet

    extend Memoist

    def initialize
      @config = Rails.configuration.manifold.css_validator
    end

    # @param css [String] the CSS to be validated
    # @return [String] parsed and validated CSS
    def validate(css)
      reset
      return output unless css?(css)
      css = extract_at_rules(css)
      @parser.load_string!(css.dup)
      parser.each_selector(&method(:visit_selector))
      output
    end

    # Removes disallowed declarations from declarations
    # @param declarations [String]
    # @param selector [String, nil]
    # @return [String]
    def validate_declarations(declarations, selector = nil)
      cleaned = []
      parse_declarations(declarations).each_declaration do |property, value, important|
        new_value = map_value(property, value)
        new_value = maybe_transform_font_sizes(new_value) if property == "font-size"
        next unless allowed_property?(property, selector, new_value)
        cleaned.push compose_declaration(property, new_value, important)
      end
      cleaned
    end

    # 12pt = 16px
    def calc_rel_font_size_ratio(value)
      if (value =~ /\d+pt/).present?
        (value.to_f / 12).round(3)
      elsif (value =~ /\d+px/).present?
        (value.to_f / 16).round(3)
      elsif (value =~ /\d+em/).present?
        value
      end
    end

    def maybe_transform_font_sizes(value)
      calculated = calc_rel_font_size_ratio value
      return "#{calculated.to_f}rem" if calculated.present?
      value
    end

    # Creates inverted declarations from declarations
    # @param declarations [String]
    # @return [String]
    def create_inverted_declarations(declarations)
      cleaned = []
      parse_declarations(declarations).each_declaration do |property, value, important|
        next unless invertable_property?(property, value)
        inverted_value = inverted_value(value)
        cleaned.push compose_declaration(property, inverted_value, important)
      end
      cleaned
    end

    private

    # Move supported at rules in buffered @out output, and return remaining declarations
    # @param css [String]
    # @return [String]
    def extract_at_rules(css)
      out = ""
      css.each_line do |line|
        # rubocop:disable Style/DoubleNegation
        if !!(line =~ /^(\s*)@(.*);(\s*)$/)
          @out << line
        else
          out << line
        end
        # rubocop:enable Style/DoubleNegation
      end
      out
    end

    # @return [CssParser::Parser]
    def parser
      @parser ||= CssParser::Parser.new
    end

    # @return [String]
    def output
      @out.split("\n").join("\n").strip
    end

    # Reset the validator state
    def reset
      @out = ""
      @parser = CssParser::Parser.new
    end

    # Is the css param actually css?
    # @param css [String]
    # @return [Boolean]
    def css?(css)
      return false if css.blank?
      true
    end

    # @param selector [String]
    # @param declarations [String]
    # @return [nil]
    def visit_selector(selector, declarations, *_args)
      return unless allowed_selector?(selector)
      write_rule_set(selector, declarations)
      maybe_write_inverted_rule_set(selector, declarations)
      nil
    end

    # Appends to @out
    # @param selector [String]
    # @param declarations [String]
    # @return [nil]
    def write_rule_set(selector, declarations)
      adjusted_selector = apply_selector_replacements(selector)
      scoped_selector = scope_selector(adjusted_selector)
      cleaned_declarations = validate_declarations(declarations, selector)
      @out << compose_rule_set(scoped_selector, cleaned_declarations)
      nil
    end

    # Appends to @out
    # @param selector [String]
    # @param declarations [String]
    # @return [nil]
    def maybe_write_inverted_rule_set(selector, declarations)
      adjusted_selector = apply_selector_replacements(selector)
      scoped_selector = "#{@config.dark_scope} #{adjusted_selector}"
      inverted_declarations = create_inverted_declarations(declarations)
      return nil unless inverted_declarations.any?
      @out << compose_rule_set(scoped_selector, inverted_declarations)
      nil
    end

    def apply_selector_replacements(selector)
      # Replace namespaced attribute selectors
      pattern = /\[(.*\|[a-z\-_]+)(|=|~=|\|=|\$=|\*=).*\]/
      search = selector[pattern, 1]
      return selector unless search
      replace = "data-#{search.tr('|', '-')}"
      selector.gsub(search, replace)
    end

    # Prepares declarations for enumeration
    # @param declarations [String]
    # @return [CssParser::RuleSet]
    def parse_declarations(declarations)
      parser = CssParser::RuleSet.new(nil, declarations)
      parser.expand_shorthand!
      parser
    end

    # Composes a declaration from parts
    # @param property [String]
    # @param value [String]
    # @param _important [Boolean]
    # @return [String]
    def compose_declaration(property, value, _important)
      "#{property}: #{value};"
    end

    # Composes a CSS rule set from a selector and declarations
    # @param selector [String]
    # @param declarations [Array]
    # @return [String]
    def compose_rule_set(selector, declarations)
      <<~END
        #{selector} {
        #{declarations.map { |d| "    #{d}" }.join("\n")}
        }
      END
    end

    # Is the color in grayscale?
    # @param value [String]
    # @return [Boolean]
    def grayscale_value?(value)
      return false if value == "inherit"
      hex_value = hex_color_value(value)
      rgb_value = ::Paleta::Color.new(:hex, hex_value).to_array(:rgb)
      rgb_value.all? { |c| c.between?(rgb_value[0].to_i - 5, rgb_value[0].to_i + 5) }
    rescue Chroma::Errors::UnrecognizedColor
      false
    end

    # Scopes a selector
    # @param selector [String]
    # @return [String]
    def scope_selector(selector)
      return selector if scoped?(selector)
      "#{@config.scope} #{selector}"
    end

    # Maps a CSS declaration value if necessary
    # @param value [String]
    # @param property [String]
    # @return [String]
    def map_value(property, value)
      out = value
      @config.value_maps.each do |value_map|
        next if (property =~ value_map.match).nil?
        match = value_map[:entries].detect { |kvp| out == kvp[0] }
        out = match[1] unless match.nil?
      end

      out
    end

    # Converts a color to its hex value
    # @param value [String]
    # @return [String]
    def hex_color_value(value)
      ::Chroma.paint(value).to_hex
    end

    # Inverts a given color value
    # @param property [String]
    # @param value [String]
    # @return [String]
    def inverted_value(value)
      hex_value = hex_color_value(value)
      color = ::Paleta::Color.new(:hex, hex_value).invert.hex
      "##{color}"
    end

    # Is a given property allowed generally and for the selector (if provided)?
    # @param property [String]
    # @param selector [String]
    # @param value [String]
    # @return [Boolean]
    def allowed_property?(property, selector, value)
      match = @config.exclusions.properties.detect do |exclusion|
        exclusion_matches_property?(exclusion, property, selector, value)
      end
      match.nil?
    end

    # Is a given property one we can invert for dark mode?
    # @param property [String]
    # @return [Boolean]
    def invertable_property?(property, value)
      return false unless @config.invertables.properties.include.include? property
      grayscale_value?(value)
    end

    # Is the property excluded from the exclusion config?
    # @param exclusion [Hash]
    # @param property [String]
    # @param selector [String]
    # @param value [String]
    # @return [Boolean]
    def exclusion_matches_property?(exclusion, property, selector, value)
      return false unless exclusion.key?(:exclude)
      return false unless exclusion.exclude.include? property
      return true unless exclusion.key?(:condition)
      exclusion_condition_matches?(exclusion, selector, property, value)
    end

    # Does the match condition in the exclusion match the given selector?
    # @param exclusion [Hash]
    # @param selector [String]
    # @param property [String]
    # @param value [String]
    # @return [Boolean]
    # @raise InvalidCondition if the exclusions configuration is invalid.
    def exclusion_condition_matches?(exclusion, selector, _property, value)
      return true unless exclusion.key?(:condition)
      raise InvalidCondition unless valid_selector_condition?(exclusion.condition)
      condition = exclusion.condition
      type = exclusion.condition.type
      case type
      when "selector_tag"
        return condition_selector_tag_matches?(condition, selector)
      when "value"
        return condition_value_matches?(condition, value)
      end
      false
    end

    def condition_value_matches?(condition, value)
      return false if value.blank?
      !(value =~ condition.match).nil?
    end

    def condition_selector_tag_matches?(condition, selector)
      return false if selector.blank?
      compare = tag_from_selector(selector)
      return false if compare.blank?
      !(compare =~ condition.match).nil?
    end

    # Is the condition property on an exclusion configuration valid?
    # @param condition [Hash]
    # @return [Boolean]
    def valid_selector_condition?(condition)
      condition.key?(:match) && condition.key?(:type)
    end

    # Makes a rough guess at what tag is covered by a given selector. This is not a full
    # CSS selector parser. We're using regular expressions and making a best effort to
    # determine if the rule is applied globally to a tag, rather than to a tag scoped
    # by class or ID. We do this because Manifold limits what global styles can be
    # applied to tags, to improve the reading experience.
    # @param selector [String]
    # @return [String]
    def tag_from_selector(selector)
      clean = selector.gsub(/\[.*\]/, "")
      return clean if clean.blank?
      # Find last element in combinatory selectors, strip psuedo selectors.
      tag = clean.split(/(\s?[~>+]\s?|\s)/).last.split(/[:]/).first
      tag
    end
    memoize :tag_from_selector

    # Has the selector already been scoped?
    # @param selector [String]
    # @return [Boolean]
    def scoped?(selector)
      selector.start_with? @config.scope
    end

    # Is the selector allowed?
    # @param selector [String]
    # @return [Boolean]
    def allowed_selector?(selector)
      sel = selector.downcase.strip
      pattern = Regexp.union(@config.exclusions.selectors)
      (sel =~ pattern).nil?
    end

  end

  class InvalidCondition < KeyError
  end
end
