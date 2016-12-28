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

  it "derives first and last name from full name during creation" do
    maker = Maker.create(name: "Stubblin Champflin")
    expect(maker.valid?).to be true
    expect(maker.first_name).to eq "Stubblin"
    expect(maker.last_name).to eq "Champflin"
  end

  it "returns full name" do
    maker = Maker.create(first_name: "Stubblin", last_name: "Champflin")
    expect(maker.name).to eq "Stubblin Champflin"
  end

end
