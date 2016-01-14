module Validator
  # This class takes an HTML string input and validates it. In doing so, it will parse the
  # HTML and transform it into a valid HTML structure that can be consumed by the Manifold
  # frontend. This mainly involves insuring proper nesting, and making sure that the
  # structure will work with ReactDom.
  class Stylesheet
    include Constants

    def initialize
      @out = ""
    end

    def validate(css_string)
      css = css_string.clone
      parser = CssParser::Parser.new
      @out = ""
      parser.load_string!(css)
      parser.each_selector(&method(:visit_selector))
      @out.split("\n").map(&:squish).join("\n").strip
    end

    private

    def visit_selector(*args)
      selector, declarations, _specificity = *args
      return unless valid_selector?(selector)
      @out << "#{CSS_SCOPE_SELECTOR} " unless selector.start_with?(CSS_SCOPE_SELECTOR)
      @out << "#{selector} { "
      ruleset = CssParser::RuleSet.new(nil, declarations)
      ruleset.expand_shorthand!
      ruleset.each_declaration do |property, value, _important|
        unless css_property_blacklist_for_selector(selector).include?(property)
          @out << "  #{property}: #{value}; "
        end
      end
      @out << "}\n"
    end

    def css_property_blacklist_for_selector(selector)
      tag = rightmost_selection(selector)
      blacklist = Validator::Constants::CSS_PROPERTY_BLACKLIST
      return blacklist if tag.include?(".") || tag.include?("#")
      tag_constant = "TAG_#{tag.upcase}_CSS_PROPERTY_BLACKLIST"
      if Validator::Constants.const_defined?(tag_constant)
        blacklist |= Validator::Constants.const_get(tag_constant)
      end
      blacklist
    end

    def rightmost_selection(selector)
      selector.split(/[, >\+~]/).last.split(/[\[:]/).first
    end

    def valid_selector?(selector)
      tag = rightmost_selection(selector)
      !CSS_SELECTOR_BLACKLIST.include?(tag)
    end
  end
end
