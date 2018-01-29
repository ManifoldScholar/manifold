require "rails_helper"

RSpec.describe Maker, type: :model do

  it "has a valid factory" do
    expect(FactoryGirl.build(:maker)).to be_valid
  end

  it "has many collaborators" do
    maker = Maker.new
    5.times { maker.collaborators << Collaborator.new }
    expect(maker.collaborators.length).to be 5
  end

  it "has a correctly formatted full name" do
    maker = Maker.create(first_name: "Stubblin", middle_name: "Bumblin", last_name: "Champflin", suffix: "III")
    expect(maker.full_name).to eq "Stubblin Bumblin Champflin III"
  end

  it "has a collection of associated makers" do
    maker = FactoryGirl.create(:maker)
    2.times { maker.users << FactoryGirl.create(:user) }
    expect(maker.users.count).to eq(2)
  end

end
