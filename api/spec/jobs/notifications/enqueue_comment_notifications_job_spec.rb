require "rails_helper"

RSpec.describe Notifications::EnqueueCommentNotificationsJob, type: :job do
  describe "#perform" do
    let(:project) { FactoryBot.create(:project) }
    let(:text) { FactoryBot.create(:text, project: project) }
    let(:text_section) { FactoryBot.create(:text_section, text: text) }
    let(:parent_creator) { FactoryBot.create(:user) }
    let(:subject_creator) { FactoryBot.create(:user) }
    let(:subject) { FactoryBot.create(:annotation, text_section: text_section, creator: subject_creator)}
    let(:editor) { FactoryBot.create(:user, :editor) }
    let(:project_editor) { FactoryBot.create(:user) }
    let(:author) { FactoryBot.create(:user) }
    let(:parent) { FactoryBot.create(:comment, subject: subject)}
    let(:comment) { FactoryBot.create(:comment, subject: subject, parent: parent)}

    before(:each) do
      editor.update(notification_preferences_by_kind: { project_comments_and_annotations: NotificationFrequency[:always] })
      author.add_role(:project_author, project)
      project_editor.add_role(:project_editor, project)
      author.update(notification_preferences_by_kind: { project_comments_and_annotations: NotificationFrequency[:always] })
      project_editor.update(notification_preferences_by_kind: { project_comments_and_annotations: NotificationFrequency[:always] })
      subject_creator.update(notification_preferences_by_kind: { replies_to_me: NotificationFrequency[:always] })
      parent_creator.update(notification_preferences_by_kind: { replies_to_me: NotificationFrequency[:always] })
    end

    it "enqueues a SendCommentNotification job for each recipient" do
      expect do
        described_class.new.perform(comment.id)
      end.to have_enqueued_job(Notifications::SendCommentNotificationJob).with(editor.id, comment.id)
    end

    it "enqueues a SendCommentNotification job for the project editor" do
      expect do
        described_class.new.perform(comment.id)
      end.to have_enqueued_job(Notifications::SendCommentNotificationJob).with(project_editor.id, comment.id)
    end

    it "enqueues a SendCommentNotification job for the author" do
      expect do
        described_class.new.perform(comment.id)
      end.to have_enqueued_job(Notifications::SendCommentNotificationJob).with(author.id, comment.id)
    end

    it "enqueues a SendReplyNotification job for the subject creator" do
      expect do
        described_class.new.perform(comment.id)
      end.to have_enqueued_job(Notifications::SendReplyNotificationJob).with(subject_creator.id, comment.id)
    end

    it "enqueues a SendReplyNotification job for the parent creator" do
      expect do
        described_class.new.perform(comment.id)
      end.to have_enqueued_job(Notifications::SendReplyNotificationJob).with(subject_creator.id, comment.id)
    end
  end
end
