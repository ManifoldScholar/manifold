# This class takes an HTML string input and validates it. In doing so, it will parse the
# HTML and transform it into a valid HTML structure that can be consumed by the Manifold
# frontend. This mainly involves insuring proper nesting, and making sure that the
# structure will work with ReactDom.
class CssValidator

  PROPERTY_BLACKLIST = %w(position font-family overflow overflow-x overflow-y z-index)
  SELECTOR_BLACKLIST = %w{html body @font-face }
  SCOPE_SELECTOR = '.manifold-text-section'

  def validate(css_string)
    css = css_string.clone
    parser = CssParser::Parser.new
    out = ""
    parser.load_string!(css)
    parser.each_selector do |selector, declarations, specificity|
      unless SELECTOR_BLACKLIST.include?(selector)
        out << "#{SCOPE_SELECTOR} " unless selector.start_with?(SCOPE_SELECTOR)
        out << "#{selector} { "
        ruleset = CssParser::RuleSet.new(nil, declarations)
        ruleset.expand_shorthand!
        ruleset.each_declaration do |property, value, important|
          unless PROPERTY_BLACKLIST.include?(property)
          out << "  #{property}: #{value}; "
          end
        end
        out << "}\n"
      end
    end
    out.split("\n").map(&:squish).join("\n").strip
  end

end
