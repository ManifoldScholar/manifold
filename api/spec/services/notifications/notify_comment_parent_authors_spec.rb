require "rails_helper"

RSpec.describe Notifications::NotifyCommentParentAuthors do
  let(:subject_author) { FactoryBot.create(:user) }
  let(:parent_author) { FactoryBot.create(:user) }
  let(:subject) { FactoryBot.create(:annotation, creator: subject_author) }

  before(:each) do
    allow(NotificationMailer).to receive(:reply_notification).and_call_original
    subject_author.update(notification_preferences_by_kind: { replies_to_me: NotificationFrequency[:always] })
    parent_author.update(notification_preferences_by_kind: { replies_to_me: NotificationFrequency[:always] })


  end

  context "when reply to annotation" do
    it "is sent to the annotation creator" do
      comment = FactoryBot.create(:comment, subject: subject)
      described_class.run comment: comment
      expect(NotificationMailer).to have_received(:reply_notification).with(subject_author, comment)
    end
  end

  context "when reply to comment" do
    let(:parent) { FactoryBot.create(:comment, subject: subject, creator: parent_author) }
    let(:comment) { FactoryBot.create(:comment, parent: parent, subject: subject) }

    it "is sent to the subject creator" do
      described_class.run comment: comment
      expect(NotificationMailer).to have_received(:reply_notification).with(subject_author, comment)
    end

    it "is sent to the parent comment creator" do
      described_class.run comment: comment
      expect(NotificationMailer).to have_received(:reply_notification).with(parent_author, comment)
    end
  end
end
