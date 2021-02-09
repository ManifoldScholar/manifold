require "rails_helper"

RSpec.describe Notifications::EnqueueDigestsJob, type: :job do

  describe "#perform" do

    let(:daily) { NotificationFrequency[:daily] }
    let(:weekly) { NotificationFrequency[:weekly] }
    let(:always) { NotificationFrequency[:always] }
    let(:user) { user = FactoryBot.create(:user, role: :admin) }
    let(:daily_notifications) { { digest: daily,  followed_projects: always } }
    let(:weekly_notifications) { { digest: weekly,  followed_projects: always } }
    let(:project_a) { FactoryBot.create(:project) }

    before(:each) do
      user.collect_model! project_a
      user.save!
      Timecop.freeze(Date.today - 1.day) do
        @a_annotation_event = FactoryBot.create(:event,
                                                event_type: EventType[:text_annotated],
                                                subject: FactoryBot.create(:annotation),
                                                project: project_a)
      end
      Timecop.freeze(Date.today - 7.day) do
        @a_annotation_event = FactoryBot.create(:event,
                                                event_type: EventType[:text_annotated],
                                                subject: FactoryBot.create(:annotation),
                                                project: project_a)
      end
    end

    it "enqueues a daily SendReplyNotification job a user who wants a daily digest" do
      user.update(notification_preferences_by_kind: daily_notifications)
      expect do
        described_class.new.perform("daily")
      end.to have_enqueued_job(Notifications::SendDigestJob).with(user.id, "daily")
    end

    it "does not enqueue a daily SendReplyNotification job for a user who wants a weekly digest" do
      expect do
        user.update(notification_preferences_by_kind: weekly_notifications)
        described_class.new.perform("daily")
      end.to_not have_enqueued_job(Notifications::SendDigestJob).with(user.id, "daily")
    end

    it "enqueues a weekly SendReplyNotification job for a user who wants a weekly digest" do
      expect do
        user.update(notification_preferences_by_kind: weekly_notifications)
        described_class.new.perform("weekly")
      end.to have_enqueued_job(Notifications::SendDigestJob).with(user.id, "weekly")
    end

    it "does not enqueues a weekly SendReplyNotification job for a user who wants a daily digest" do
      expect do
        user.update(notification_preferences_by_kind: daily_notifications)
        described_class.new.perform("weekly")
      end.to_not have_enqueued_job(Notifications::SendDigestJob).with(user.id, "weekly")
    end

  end

end
