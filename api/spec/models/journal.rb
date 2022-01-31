require "rails_helper"

RSpec.describe Journal, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:journal)).to be_valid
  end

end
