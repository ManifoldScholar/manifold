require "rails_helper"

RSpec.describe Stylesheet, type: :model do
  let(:stylesheet) { FactoryBot.create(:stylesheet) }

  it "has a valid factory" do
    expect(FactoryBot.build(:stylesheet)).to be_valid
  end

  it "is invalid without a name" do
    expect(FactoryBot.build(:stylesheet, name: nil)).to_not be_valid
  end

  it "changes the computed styles when its raw styles change" do
    stylesheet.raw_styles = ".some-class { color: red }"
    expect { stylesheet.save }.to change(stylesheet, :styles)
  end

  it "does not destroy text section records on destroy" do
    stylesheet.text_sections << FactoryBot.create(:text_section)
    expect { stylesheet.destroy }.to_not change { TextSection.count }
  end

  context "when raw_styles have changed" do
    let(:stylesheet) { FactoryBot.create(:stylesheet) }

    it "pretty formats the styles" do
      stylesheet.raw_styles = ".selector{attribute:value}"
      stylesheet.save
      expect(stylesheet.raw_styles).to eq ".selector {\n    attribute: value;\n}"
    end
  end
end
