require "rails_helper"

RSpec.describe Notifications::SendReplyNotificationJob, type: :job do
  describe "#perform" do
    let(:editor) { FactoryBot.create(:user, :admin) }
    let(:comment) { FactoryBot.create(:comment) }

    it "sends an a reply notification email to the user" do
      described_class.new.perform(editor.id, comment.id)
      mail = ActionMailer::Base.deliveries.last
      expect(mail.to).to eq [editor.email]
    end
  end
end
