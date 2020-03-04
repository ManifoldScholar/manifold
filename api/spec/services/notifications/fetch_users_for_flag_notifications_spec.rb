require "rails_helper"

RSpec.describe Notifications::FetchUsersForFlagNotification do
  let(:editor) { FactoryBot.create(:user, :admin) }
  let(:always) { NotificationFrequency[:always] }
  let(:never) { NotificationFrequency[:never] }
  let(:do_notify) { { flagged_resources: always } }
  let(:do_not_notify) { { flagged_resources: never } }

  context "when the flag is created" do
    it "the returned users includes the editor when the editor wants notification" do
      editor.update(notification_preferences_by_kind: do_notify)
      flag = FactoryBot.create(:flag)
      outcome = described_class.run flag: flag
      expect(outcome.result.include? editor).to be true
    end

    it "the returned users does not include the editor when the editor does not want notification" do
      editor.update(notification_preferences_by_kind: do_not_notify)
      flag = FactoryBot.create(:flag)
      outcome = described_class.run flag: flag
      expect(outcome.result.include? editor).to be false
    end
  end
end
