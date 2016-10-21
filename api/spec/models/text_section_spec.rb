require "rails_helper"

RSpec.describe TextSection, type: :model do
  it "has a valid factory" do
    expect(FactoryGirl.build(:text_section)).to be_valid
  end

  it "belongs to a text" do
    text_section = TextSection.new
    text = Text.new
    text_section.text = text
    expect(text_section.text).to be text
  end

  it "belongs to a resource" do
    text_section = TextSection.new
    resource = Resource.new
    text_section.resource = resource
    expect(text_section.resource).to be resource
  end

end
