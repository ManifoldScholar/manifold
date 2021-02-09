require "rails_helper"

RSpec.describe Favorite, type: :model do
  let!(:user) { FactoryBot.create :user }
  let!(:user_collected_project) { FactoryBot.create :user_collected_project, user: user }
  let!(:favorite) { Favorite.where(favoritable: user_collected_project.project, user: user).first! }

  it "serves as a simple reference" do
    expect(favorite.user_collected_entry).to eq user_collected_project
  end
end
