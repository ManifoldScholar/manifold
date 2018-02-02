require "rails_helper"

RSpec.describe Flag, type: :model do

  it "has a valid flag factory" do
    expect(FactoryBot.build(:flag)).to be_valid
  end

  describe "is invalid when" do
    let(:flag) { FactoryBot.build(:flag) }

    it "creator is nil" do
      flag.creator = nil
      expect(flag).to_not be_valid
    end

    it "flaggable is nil" do
      flag.flaggable = nil
      expect(flag).to_not be_valid
    end
  end
end
