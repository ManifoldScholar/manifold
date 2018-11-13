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

    it "is valid with a single first or last name" do
      expect(FactoryBot.build(:maker, first_name: "Rowan", last_name: nil, name: nil)).to be_valid
    end

    it "is invalid without a single first or last name" do
      expect(FactoryBot.build(:maker, name: nil, first_name: nil, last_name: nil)).to_not be_valid
    end
  end

  describe "its with_order scope" do
    before(:each) do
      Maker.create(name: "Rowan Ono")
      Maker.create(name: "Ida")
      Maker.create(name: "Sir Stubblin Champflin III")
    end

    it "returns the correct order" do
      expect(Maker.with_order.pluck(:last_name, :first_name)).to eq [
                                                                      %w(Champflin Stubblin),
                                                                      [nil, "Ida"],
                                                                      %w(Ono Rowan)
                                                                    ]
    end
  end

end
