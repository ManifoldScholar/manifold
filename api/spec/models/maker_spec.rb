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

end
