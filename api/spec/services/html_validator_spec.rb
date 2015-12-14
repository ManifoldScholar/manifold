require "rails_helper"

RSpec.describe HtmlValidator do

  let(:validator) { HtmlValidator.new() }

  it "should wrap top level siblings in a div element" do
    fragment = "<p>AAA</p><p>BBB</p>"
    valid = "<div><p>AAA</p><p>BBB</p></div>"
    expect(validator.validate(fragment).gsub("\n", "")).to eq(valid)
  end

  it "should ensure that an option tag is wrapped in a select tag" do
    fragment = "<div><option></option></div>"
    valid = "<div><select><option></option></select></div>"
    expect(validator.validate(fragment).gsub("\n", "")).to eq(valid)
  end

  it "should not wrap a caption tag in a tbody tag when fixing table markup" do
    fragment = "<table><caption>AAA</caption><tr><td>BBB</td></tr><tr><td>CCC</td>" +
               "</tr></table>"
    valid = "<table><caption>AAA</caption><tbody><tr><td>BBB</td></tr><tr><td>CCC</td>" +
            "</tr></tbody></table>"
    expect(validator.validate(fragment).gsub("\n", "")).to eq(valid)
  end

  it "should wrap sibling TR tags in a TBODY tag" do
    fragment = "<table><tr><td>A</td></tr><tr><td>B</td></tr></table>"
    valid = "<table><tbody><tr><td>A</td></tr><tr><td>B</td></tr></tbody></table>"
    expect(validator.validate(fragment).gsub("\n", "")).to eq(valid)
  end

  it "should not double wrap sibling TR tags in a TBODY tag" do
    fragment = "<table><tbody><tr><td>A</td></tr><tr><td>B</td></tr></tbody></table>"
    expect(validator.validate(fragment).gsub("\n", "")).to eq(fragment)
  end

  it "should not wrap sibling TR tags already in TFOOT in a TBODY tag" do
    fragment = "<table><tfoot><tr><td>A</td></tr><tr><td>B</td></tr></tfoot></table>"
    expect(validator.validate(fragment).gsub("\n", "")).to eq(fragment)
  end



end
