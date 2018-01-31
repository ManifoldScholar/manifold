require "rails_helper"

RSpec.describe Favorite, type: :model do
  it "has a valid factory" do
    favorite = FactoryBot.build(:favorite)
    expect(favorite).to be_valid
  end

  it "should be invalid without a user" do
    favorite = Favorite.new user: nil
    expect(favorite).to_not be_valid
  end

  it "should be invalid without a favoritable" do
    favorite = Favorite.new favoritable: nil
    expect(favorite).to_not be_valid
  end

  it "should be valid with a user and a favoritable" do
    favorite = Favorite.new favoritable: Project.new, user: User.new
    expect(favorite).to be_valid
  end

  it "should be unique" do
    user = FactoryBot.create(:user)
    project = FactoryBot.create(:project)
    FactoryBot.create(:favorite, favoritable: project, user: user)
    duplicate_favorite = FactoryBot.build(:favorite,
                                           favoritable: project, user: user)
    expect(duplicate_favorite).to_not be_valid
  end

  it "knows what project it belongs to" do
    favorite = FactoryBot.build(:favorite)
    expect(favorite.project).to be_a Project
  end
end
