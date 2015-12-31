require "rails_helper"

RSpec.configure do |c|
  c.include Helpers
end

RSpec.describe CssValidator do
  let(:scope_selector) { CssValidator::SCOPE_SELECTOR }
  let(:validator) { CssValidator.new() }
  let(:blacklisted_property) { CssValidator::PROPERTY_BLACKLIST.first}

  it "should return a string" do
    valid_css = "#{scope_selector} p { font-weight: bold; }"
    expect(validator.validate(valid_css)).to be_an_instance_of String
  end

  it "should return the same CSS if valid" do
    valid_css = "#{scope_selector} p { font-weight: bold; }"
    results = validator.validate(valid_css)
    expect(compact(results)).to eq compact(valid_css)
  end

  it "should scope rules with #{CssValidator::SCOPE_SELECTOR}" do
    invalid = "p { font-weight: bold; }"
    valid = "#{scope_selector} p { font-weight: bold; }"
    results = validator.validate(invalid)
    expect(compact(results)).to eq compact(valid)
  end

  it "should correctly scope nested selectors with #{CssValidator::SCOPE_SELECTOR}" do
    invalid = "p ul { font-weight: bold; }"
    valid = "#{scope_selector} p ul { font-weight: bold; }"
    results = validator.validate(invalid)
    expect(compact(results)).to eq compact(valid)
  end

  it "should correctly scope sibling + nested selectors with #{CssValidator::SCOPE_SELECTOR}" do
    invalid = "span, p ul { font-weight: bold; }"
    valid = "#{scope_selector} span { font-weight: bold; }
             #{scope_selector} p ul { font-weight: bold; }"
    results = validator.validate(invalid)
    expect(compact(results)).to eq compact(valid)
  end

  it "should not allow a blacklisted property" do
    invalid = "p { #{blacklisted_property}: some_value; }"
    valid = "#{scope_selector} p { }"
    results = validator.validate(invalid)
    expect(compact(results)).to eq compact(valid)
  end

  it "should not allow a blacklisted selector" do
    invalid = "body { font-weight: bold; }"
    valid = ""
    results = validator.validate(invalid)
    expect(compact(results)).to eq compact(valid)
  end

  it "should not allow a @font-family selector" do
    invalid = "@font-face { font-family: \"Gallery\"; }"
    valid = ""
    results = validator.validate(invalid)
    expect(compact(results)).to eq compact(valid)
  end

  it "should properly scope multiple selectors" do
    invalid = "span, p { font-weight: bold; }"
    valid = "#{scope_selector} span { font-weight: bold; }
             #{scope_selector} p { font-weight: bold; }"
    results = validator.validate(invalid)
    expect(compact(results)).to eq compact(valid)
  end

  it "should not allow a blacklisted selector when there are mutliple selectors" do
    invalid = "body, p { font-weight: bold; }"
    valid = "#{scope_selector} p { font-weight: bold; }"
    results = validator.validate(invalid)
    expect(compact(results)).to eq compact(valid)
  end

  it "should pass through allowed properties" do
    invalid = "p { #{blacklisted_property}: some_value; font-weight: bold; }"
    valid = "#{scope_selector} p { font-weight: bold; }"
    results = validator.validate(invalid)
    expect(compact(results)).to eq compact(valid)
  end


end
