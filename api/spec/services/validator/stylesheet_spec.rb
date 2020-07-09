require "rails_helper"

# rubocop:disable Layout/LineLength
# rubocop:disable Style/StringLiteralsInInterpolation
RSpec.describe Validator::Stylesheet do
  let(:scope_selector) { Rails.configuration.manifold.css_validator.defaults.class_scope }
  let(:dark_scope_selector) { Rails.configuration.manifold.css_validator.defaults.dark_scope }
  let(:validator) { Validator::Stylesheet.new }
  let(:blacklisted_property) { "font-family" }

  it "should return a string" do
    valid_css = "#{scope_selector} p { text-decoration: underline; }"
    expect(validator.validate(valid_css)).to be_an_instance_of String
  end

  it "should not preface namespace" do
    valid_css = "@namespace epub \"http://www.idpf.org/2007/ops\";"
    results = validator.validate(valid_css)
    expect(results).to eq_ignoring_whitespace valid_css
  end

  it "should maintain namespaces" do
    valid_css = <<~HEREDOC
    @charset "UTF-8";
    @namespace epub "http://www.idpf.org/2007/ops";

    abbr.name{
      white-space: nowrap;
    }
    HEREDOC
    validated_css = <<~HEREDOC
    @charset "UTF-8";
    @namespace epub "http://www.idpf.org/2007/ops";

    #{scope_selector} abbr.name{
      white-space: nowrap;
    }
    HEREDOC
    results = validator.validate(valid_css)
    expect(results).to eq_ignoring_whitespace validated_css
  end

  # XHTML supports namespaced selectors, but HTML does not.
  describe "when mapping attributes" do
    operators = %w(*=)
    operators.each do |op|
      it "it should translate namespaced a namespaced attribute to data a data attribute with an #{op} operator" do
        invalid_css = "#{scope_selector} section[epub|type#{op}\"imprint\"] { text-decoration: underline; }"
        valid_css = "#{scope_selector} section[data-epub-type#{op}\"imprint\"] { text-decoration: underline; }"
        results = validator.validate(invalid_css)
        expect(results).to eq_ignoring_whitespace valid_css
      end
    end
  end

  it "should return the same CSS if valid" do
    valid_css = "#{scope_selector} p { text-decoration: underline; }"
    results = validator.validate(valid_css)
    expect(results).to eq_ignoring_whitespace valid_css
  end

  it "should scope all CSS selectors" do
    invalid = "p { text-decoration: underline; }"
    valid = "#{scope_selector} p { text-decoration: underline; }"
    results = validator.validate(invalid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "should correctly scope nested selectors with configured scoped selector" do
    invalid = "p ul { text-decoration: underline; }"
    valid = "#{scope_selector} p ul { text-decoration: underline; }"
    results = validator.validate(invalid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "should correctly scope sibling + nested selectors with configured scoped selector" do
    invalid = "span, p ul { text-decoration: underline; }"
    valid = "#{scope_selector} span { text-decoration: underline; }
             #{scope_selector} p ul { text-decoration: underline; }"
    results = validator.validate(invalid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "should not allow a blacklisted property" do
    invalid = "p { #{blacklisted_property}: some_value; }"
    valid = "#{scope_selector} p { }"
    results = validator.validate(invalid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "should not allow a blacklisted selector" do
    invalid = "body { font-weight: bold; }"
    valid = ""
    results = validator.validate(invalid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "should not allow a blacklisted selector when there are multiple selectors" do
    invalid = "body, p { text-decoration: underline; }"
    valid = "#{scope_selector} p { text-decoration: underline; }"
    results = validator.validate(invalid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "should not allow a * selector" do
    invalid = "* { font-weight: bold; }"
    valid = ""
    results = validator.validate(invalid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "should not allow a @font-family selector" do
    invalid = "@font-face { font-family: \"Gallery\"; }"
    valid = ""
    results = validator.validate(invalid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "should properly scope multiple selectors" do
    invalid = "span, p { text-decoration: underline; }"
    valid = "#{scope_selector} span { text-decoration: underline; }
             #{scope_selector} p { text-decoration: underline; }"
    results = validator.validate(invalid)
    expect(results).to eq_ignoring_whitespace valid
  end

  describe "with complex selectors" do
    invalid_test_cases = [
      ["element", "* { foo: bar; }"],
      ["general sibling", "div ~ * { foo: bar; }"],
      ["adjacent sibling", "div + * { foo: bar; }"],
      ["child combinator", "div > * { foo: bar; }"],
      ["descendant combinator", "div * { foo: bar; }"],
      ["negation psuedo class", "*:not(foo) { foo: bar; }"],
      ["after psuedo-element", "*:after { foo: bar; }"],
      ["before psuedo-element", "*:before { foo: bar; }"],
      ["first-letter psuedo-element", "*:first-letter { foo: bar; }"],
      ["first-line psuedo-element", "*:first-line { foo: bar; }"],
      ["checked psuedo-class", "*:checked { foo: bar; }"],
      ["disabled psuedo-class", "*:disabled { foo: bar; }"],
      ["enabled psuedo-class", "*:enabled { foo: bar; }"],
      ["lang psuedo-class", "*:lang { foo: bar; }"],
      ["target psuedo-class", "*:target { foo: bar; }"],
      ["focus psuedo-class", "*:focus { foo: bar; }"],
      ["hover psuedo-class", "*:hover { foo: bar; }"],
      ["active psuedo-class", "*:active { foo: bar; }"],
      ["visited psuedo-class", "*:visited { foo: bar; }"],
      ["link psuedo-class", "*:link { foo: bar; }"],
      ["empty psuedo-class", "*:empty { foo: bar; }"],
      ["only-of-type psuedo-class", "*:only-of-type { foo: bar; }"],
      ["only-child psuedo-class", "*:only-child { foo: bar; }"],
      ["last-of-type psuedo-class", "*:last-of-type { foo: bar; }"],
      ["first-of-type psuedo-class", "*:first-of-type { foo: bar; }"],
      ["last-child psuedo-class", "*:last-child { foo: bar; }"],
      ["first-child psuedo-class", "*:first-child { foo: bar; }"],
      ["nth-of-type(1) psuedo-class", "*:nth-of-type(1) { foo: bar; }"],
      ["nth-last-of-type(1) psuedo-class", "*:nth-last-of-type(1) { foo: bar; }"],
      ["nth-child(1) psuedo-class", "*:nth-child(1) { foo: bar; }"],
      ["root psuedo-class", "*:root { foo: bar; }"],
      ["attribute selector", "*[foo=\"bar\"] { foo: bar; }"]
    ]
    valid_test_cases = invalid_test_cases.map { |test_case| [test_case[0], test_case[1].sub("*", "div")] }

    invalid_test_cases.each do |test_case|
      it "it does not allow blacklisted selector when selector is #{test_case[0]} selector: #{test_case[1]}" do
        expect(validator.validate(test_case[1])).to eq_ignoring_whitespace ""
      end
    end

    valid_test_cases.each do |test_case|
      it "it does allow non-blacklisted selector when selector is #{test_case[0]} selector: #{test_case[1]}" do
        valid = scope_selector + " " + test_case[1]
        expect(validator.validate(test_case[1])).to eq_ignoring_whitespace compact(valid)
      end
    end
  end

  it "should pass through allowed properties" do
    invalid = "p { #{blacklisted_property}: some_value; text-decoration: underline; }"
    valid = "#{scope_selector} p { text-decoration: underline; }"
    results = validator.validate(invalid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "should respect the tag specific property blacklist" do
    invalid = "#{scope_selector} a { color: red }"
    valid = "#{scope_selector} a { }"
    results = validator.validate(invalid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "should ignore the tag specific property blacklist for class selectors" do
    valid = "#{scope_selector} a.something { color: red; }"
    results = validator.validate(valid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "should ignore the tag specific property blacklist for class selectors when there's no tag" do
    valid = "#{scope_selector} .ept { margin-top: 50px; }"
    results = validator.validate(valid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "should ignore the tag specific property blacklist for ID selectors" do
    valid = "#{scope_selector} a#something { color: red; }"
    results = validator.validate(valid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "rewrites mapped css values" do
    invalid = ".au { font-size: medium; }"
    valid = "#{scope_selector}  .au { font-size: 1rem; }"
    results = validator.validate(invalid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "does not rewrite unmapped css values" do
    valid = "#{scope_selector} h2 { this_will_never_be_blacklisted: value; }"
    results = validator.validate(valid)
    expect(results).to eq_ignoring_whitespace valid
  end

  describe "font-sizes" do
    it "are mapped to rem units when absolute" do
      invalid = ".test { font-size: 22pt; }"
      valid = "#{scope_selector}  .test { font-size: 1.833rem; }"
      results = validator.validate(invalid)
      expect(results).to eq_ignoring_whitespace valid
    end

    it "are mapped to rem units when relative" do
      invalid = ".test { font-size: 1em; }"
      valid = ".test { font-size: 1.0rem; }"
      results = validator.validate(invalid)
      expect(results).to eq_ignoring_whitespace ".manifold-text-section #{valid}"
    end
  end

  it "strips 400 font weights" do
    invalid = "#{scope_selector} span { font-weight: 400 }"
    valid = "#{scope_selector} span { }"
    results = validator.validate(invalid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "strips normal font weights" do
    invalid = "#{scope_selector} span { font-weight: normal }"
    valid = "#{scope_selector} span { }"
    results = validator.validate(invalid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "only strips normal values when the property is font-weight" do
    valid = "#{scope_selector} span { display: normal; }"
    results = validator.validate(valid)
    expect(results).to eq_ignoring_whitespace valid
  end

  it "creates a dark style for grayscale values" do
    selector = "p { color: #000000 }"
    valid = "#{scope_selector} p { color: #000000; }"
    dark_style = "#{dark_scope_selector} p { color: #FFFFFF; }"
    results = validator.validate(selector)
    expect(results).to eq_ignoring_whitespace "#{valid}#{dark_style}"
  end

  it "does not create a dark style for non-grayscale values" do
    selector = "p { color: blue }"
    valid = "#{scope_selector} p { color: blue; }"
    results = validator.validate(selector)
    expect(results).to eq_ignoring_whitespace "#{valid}"
  end

  it "allows classes that contain the word body" do
    selector = ".bodytext { text-indent: 1em; }"
    valid = "#{scope_selector} .bodytext { text-indent: 1em; }"
    results = validator.validate(selector)
    expect(results).to eq_ignoring_whitespace "#{valid}"
  end

  it "maps UTF8 characters to hexadecimal equivalent" do
    selector = ".foo > li:before{content:\"●  \"}"
    valid = ".manifold-text-section .foo > li:before {content: \"\\25cf  \";}"
    results = validator.validate(selector)
    expect(results).to eq_ignoring_whitespace "#{valid}"
  end

end
