require "rails_helper"

RSpec.describe NotificationPreference, type: :model do
  let!(:user) { FactoryBot.create(:user, :admin) }

  it "has a valid factory" do
    np = FactoryBot.build(:notification_preference)
    expect(np).to be_valid
  end

  context "when kind is 'followed_projects'" do
    # Users are assigned notification preferences on create
    it "has a default frequency of 'always'" do
      user = FactoryBot.create(:user)
      np = user.notification_preferences.find_by(kind: "followed_projects")
      expect(np.frequency.to_s).to eq "always"
    end
  end

  it "has a scope that returns preferences by frequency" do
    user.notification_preferences_by_kind = { followed_projects: "always", replies_to_me: "always" }
    user.save
    expect(NotificationPreference.by_frequency("always").count).to eq 2
  end

  it "has a scope that returns preferences by kind" do
    expect(NotificationPreference.by_kind(:replies_to_me).count).to eq 1
  end
end
