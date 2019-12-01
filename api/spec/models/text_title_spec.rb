require "rails_helper"

RSpec.describe TextTitle, type: :model do
  it "belongs to a text" do
    text_title = TextTitle.new
    text = Text.new
    text_title.text = text
    expect(text_title.text).to be text
  end

  describe "formats value with a markdown subset" do
    let(:raw) { "_italic_ a **bold**" }
    let(:formatted) { "<em>italic</em> a <strong>bold</strong>" }
    let(:updated_raw) { "_italic_ glorp **bold**" }
    let(:updated_formatted) { "<em>italic</em> glorp <strong>bold</strong>" }

    it "has a formatted value after save" do
      text_title = FactoryBot.create(:text_title, value: raw)
      expect(text_title.value_formatted).to eq(formatted)
    end

    it "has a formatted value cached in the database after save" do
      text_title = FactoryBot.create(:text_title, title: raw)
      expect(text_title.cached_value_formatted).to eq(formatted)
    end

    it "updates the formatted value cached in the database after update" do
      text_title = FactoryBot.create(:text_title, title: raw)
      text_title.value = updated_raw
      text_title.save
      expect(text_title.cached_value_formatted).to eq(updated_formatted)
    end
  end
end
