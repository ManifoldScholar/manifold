require "rails_helper"

RSpec.describe Notifications::FetchUsersForReplyNotification do
  let(:subject_author) { FactoryBot.create(:user) }
  let(:parent_author) { FactoryBot.create(:user) }
  let(:subject) { FactoryBot.create(:annotation, creator: subject_author) }

  before(:each) do
    subject_author.update(notification_preferences_by_kind: { replies_to_me: NotificationFrequency[:always] })
    parent_author.update(notification_preferences_by_kind: { replies_to_me: NotificationFrequency[:always] })
  end

  context "when the comment is a reply to an annotation" do
    it "the returned users includes the annotation creator" do
      comment = FactoryBot.create(:comment, subject: subject)
      outcome = described_class.run comment: comment
      expect(outcome.result.include? subject_author).to be true
    end
  end

  context "when the comment is reply to another comment" do
    let(:parent) { FactoryBot.create(:comment, subject: subject, creator: parent_author) }
    let(:comment) { FactoryBot.create(:comment, parent: parent, subject: subject) }

    it "the returned users includes the subject creator" do
      outcome = described_class.run comment: comment
      expect(outcome.result.include? subject_author).to be true
    end

    it "the returned users includes the parent comment creator" do
      outcome = described_class.run comment: comment
      expect(outcome.result.include? parent_author).to be true
    end

  end
end
