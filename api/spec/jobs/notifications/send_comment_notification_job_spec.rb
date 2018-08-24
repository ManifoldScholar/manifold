require "rails_helper"

RSpec.describe Notifications::SendCommentNotificationJob, type: :job do

  describe "#perform" do

    let(:user) { FactoryBot.create(:user) }
    let(:comment) { FactoryBot.create(:comment) }

    it "sends an a comment notification email to the user" do
      described_class.new.perform(user.id, comment.id)
      mail = ActionMailer::Base.deliveries.last
      expect(mail.to).to eq [user.email]
    end

  end

end
