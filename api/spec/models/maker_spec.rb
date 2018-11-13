require "rails_helper"

RSpec.describe Maker, type: :model do

  it "has a valid factory" do
    expect(FactoryBot.build(:maker)).to be_valid
  end

  it "has many collaborators" do
    maker = Maker.new
    5.times { maker.collaborators << Collaborator.new }
    expect(maker.collaborators.length).to be 5
  end

  describe "its name" do
    let(:maker) do  FactoryBot.create(:maker,
                                      name: nil,
                                      prefix: "Sir",
                                      first_name: "Stubblin",
                                      middle_name: "Bumblin",
                                      last_name: "Champflin",
                                      suffix: "III")
    end

    it "has a correctly formatted #full_name" do
      expect(maker.full_name).to eq "Sir Stubblin Bumblin Champflin III"
    end

    it "has a correctly formatted #name" do
      expect(maker.name).to eq "Stubblin Champflin"
    end
  end

end
