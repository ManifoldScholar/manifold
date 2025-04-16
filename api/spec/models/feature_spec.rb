require "rails_helper"

RSpec.describe Feature, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:feature)).to be_valid
  end

  it_behaves_like "a model with formatted attributes"
end
