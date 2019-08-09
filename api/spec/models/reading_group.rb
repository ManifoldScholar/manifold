require "rails_helper"

RSpec.describe ReadingGroup, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:reading_group)).to be_valid
  end

  it "can be persisted" do
    expect(FactoryBot.create(:reading_group).persisted?).to be true
  end

end
