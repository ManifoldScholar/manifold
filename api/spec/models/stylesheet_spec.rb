require "rails_helper"

RSpec.describe Stylesheet, type: :model do

  let(:stylesheet) { FactoryBot.create(:stylesheet)}

  it "has a valid factory" do
    expect(FactoryBot.build(:stylesheet)).to be_valid
  end

  it "is invalid without a name" do
    expect(FactoryBot.build(:stylesheet, name: nil)).to_not be_valid
  end

  it "changes the computed styles when its raw styles change" do
    stylesheet.raw_styles = ".some-class { color: red }"
    expect{ stylesheet.save }.to change(stylesheet, :styles)
  end

end
