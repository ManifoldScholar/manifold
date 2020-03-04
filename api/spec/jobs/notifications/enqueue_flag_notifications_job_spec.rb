require "rails_helper"

RSpec.describe Notifications::EnqueueFlagNotificationsJob, type: :job do
  describe "#perform" do
    let(:editor) { FactoryBot.create(:user, :admin) }
    let(:other_editor) { FactoryBot.create(:user, :admin) }
    let(:always) { NotificationFrequency[:always] }
    let(:never) { NotificationFrequency[:never] }
    let(:do_notify) { { flagged_resources: always } }
    let(:do_not_notify) { { flagged_resources: never } }
    let(:flag) { FactoryBot.create(:flag) }

    it "enqueues a SendCommentNotification job for each recipient" do
      editor.update(notification_preferences_by_kind: do_notify)
      other_editor.update(notification_preferences_by_kind: do_notify)
      expect do
        described_class.new.perform(flag.id)
      end.to(
        have_enqueued_job(Notifications::SendFlagNotificationJob)
          .with(editor.id, flag.id)
          .and(
            have_enqueued_job(Notifications::SendFlagNotificationJob)
              .with(other_editor.id, flag.id)
          )
      )
    end
  end
end
