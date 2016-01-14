require "rails_helper"

RSpec.describe TextTitle, type: :model do
  it "belongs to a text" do
    text_title = TextTitle.new
    text = Text.new
    text_title.text = text
    expect(text_title.text).to be text
  end
end
