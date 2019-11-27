require "rails_helper"

RSpec.describe WithParsedName do
  let(:user) { FactoryBot.create(:user, name: "Rowan Puppy") }
  let(:maker) { FactoryBot.create(:maker, name: "Countess Ida Dog III") }

  it "parses and sets the first name" do
    expect(user.first_name).to eq "Rowan"
  end

  it "parses and sets the last name" do
    expect(user.last_name).to eq "Puppy"
  end

  it "parses and sets the suffix" do
    expect(maker.suffix).to eq "III"
  end

  it "parses and sets the prefix" do
    expect(maker.prefix).to eq "Countess"
  end

  it "returns the name" do
    expect(user.name).to eq "Rowan Puppy"
  end

  describe "a model implementing with_parsed_name" do
    it "is invalid with a first_name over 50 characters long" do
      expect(FactoryBot.build(:user, first_name: Faker::Lorem.characters(number: 55))).to_not be_valid
    end

    it "is invalid with a last_name over 50 characters long" do
      expect(FactoryBot.build(:user, last_name: Faker::Lorem.characters(number: 55))).to_not be_valid
    end
  end
end


