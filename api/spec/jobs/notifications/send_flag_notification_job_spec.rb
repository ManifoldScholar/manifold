require "rails_helper"

RSpec.describe Notifications::SendFlagNotificationJob, type: :job do
  describe "#perform" do
    let(:editor) { FactoryBot.create(:user, :admin) }
    let(:always) { NotificationFrequency[:always] }
    let(:do_notify) { { flagged_resources: always } }
    let(:flag) { FactoryBot.create(:flag) }

    it "sends an a flag notification email to the user" do
      described_class.new.perform(editor.id, flag.id)
      mail = ActionMailer::Base.deliveries.last
      expect(mail.to).to eq [editor.email]
    end
  end
end
