require "rails_helper"

RSpec.describe Notifications::SendDigestJob, type: :job do
  describe "#perform" do
    let!(:user) do
      FactoryBot.create(:user).tap do |user|
        user.update! notification_preferences_by_kind: daily_notifications
      end
    end

    let!(:project) do
      FactoryBot.create(:project).tap do |project|
        user.collect_model! project
      end
    end

    let(:daily_notifications) { { digest: :daily,  followed_projects: :always, digest_comments_and_annotations: :always } }

    let!(:annotation_event) do
      Timecop.freeze Date.current.yesterday do
        FactoryBot.create(
          :event,
          event_type: EventType[:text_annotated],
          subject: FactoryBot.create(:annotation),
          project: project
        )
      end
    end

    it "sends a digest email to the user" do
      expect(Notifications::SendDigest).to receive(:run).with(frequency: "daily", user: user).and_call_original
      expect(NotificationMailer).to receive(:digest).with(user, "daily", a_kind_of(Hash)).and_call_original

      expect do
        described_class.perform_now user.id, "daily"
      end.to execute_safely
    end
  end
end
