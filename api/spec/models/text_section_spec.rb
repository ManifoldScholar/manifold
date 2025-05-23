# frozen_string_literal: true

RSpec.describe TextSection, type: :model do
  it "does not destroy stylesheet records on destroy" do
    text_section = FactoryBot.create(:text_section)
    text_section.stylesheets << FactoryBot.create(:stylesheet)
    expect { text_section.destroy }.not_to change(Stylesheet, :count)
  end

  context "when created from an api request" do
    let!(:new_section) { FactoryBot.create(:text_section, name: nil) }

    it "validates name" do
      expect(new_section).to be_invalid(:from_api)

      new_section.name = "something"

      expect(new_section).to be_valid(:from_api)
    end
  end
end
