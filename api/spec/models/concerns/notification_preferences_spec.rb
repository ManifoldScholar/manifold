# frozen_string_literal: true

require "rails_helper"

RSpec.describe NotificationPreferences do
  let(:user) { FactoryBot.create(:user, :reader) }

  it "includes a scope to retrieve users by digest frequency" do
    user.notification_preferences_by_kind = { digest: NotificationFrequency[:weekly] }
    user.save
    expect(User.with_digest_for_frequency(NotificationFrequency[:weekly])).to include user
  end

  describe "#unsubscribe_all" do
    before do
      user.update(notification_preferences_by_kind: { projects: NotificationFrequency[:always] })
      user.unsubscribe_all
    end

    it "sets frequencies to 'never'" do
      expect(user.notification_preferences_by_kind.except(:followed_projects).values).to all eq NotificationFrequency[:never]
    end

    it "sets NotificationFrequency[:followed_projects] to 'always'" do
      preference = user.notification_preferences.find_by(kind: NotificationKind[:followed_projects])

      expect(preference.frequency).to eq NotificationFrequency[:always]
    end
  end

  context "when creating user" do
    it "assigns the default preferences" do
      expect(user.notification_preferences).not_to be_nil
    end
  end

  context "when updating user" do
    context "when role is not changed" do
      it "does not change preferences" do
        expect { user.save! }.not_to change { user.notification_preferences.reload.to_a }
      end
    end

    context "when role is changed" do
      let!(:user) { FactoryBot.create :user, :admin }

      it "reassigns the default preferences" do
        expect do
          user.role = :editor

          user.save!
        end.to change { user.notification_preferences.reload.to_a }
      end
    end
  end

  context "when updating preferences" do
    it "assigns from a hash of kind:frequency pairs" do
      expect do
        user.notification_preferences_by_kind = { replies_to_me: NotificationFrequency[:always] }
        user.save!
      end.to change { user.notification_preferences.reload.find_by(kind: :replies_to_me).frequency.to_s }.to("always")
        .and keep_the_same { user.notification_preferences.reload.find_by(kind: :digest).frequency.to_s }
        .and keep_the_same { user.notification_preferences.reload.find_by(kind: :digest_comments_and_annotations).frequency.to_s }
        .and keep_the_same { user.notification_preferences.reload.find_by(kind: :followed_projects).frequency.to_s }
    end

    it "ignores kinds not available to user" do
      user.notification_preferences_by_kind = { digest_comments_and_annotations: NotificationFrequency[:always] }

      expect { user.save }.not_to change { user.notification_preferences.count }
    end
  end
end
