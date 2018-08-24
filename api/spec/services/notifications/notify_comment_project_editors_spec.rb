require "rails_helper"

RSpec.describe Notifications::NotifyCommentProjectEditors do
  let(:project) { FactoryBot.create(:project) }
  let(:text) { FactoryBot.create(:text, project: project) }
  let(:text_section) { FactoryBot.create(:text_section, text: text) }
  let(:subject) { FactoryBot.create(:annotation, text_section: text_section)}
  let(:editor) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
  let(:project_editor) { FactoryBot.create(:user) }
  let(:author) { FactoryBot.create(:user) }

  before(:each) do
    allow(NotificationMailer).to receive(:reply_notification).and_call_original
    editor.update(notification_preferences_by_kind: { project_comments_and_annotations: NotificationFrequency[:always] })
    author.add_role(Role::ROLE_PROJECT_AUTHOR, project)
    project_editor.add_role(Role::ROLE_PROJECT_EDITOR, project)
    author.update(notification_preferences_by_kind: { project_comments_and_annotations: NotificationFrequency[:always] })
    project_editor.update(notification_preferences_by_kind: { project_comments_and_annotations: NotificationFrequency[:always] })
  end

  it "enqueues a NotifyThreadProjectEditorsJob job" do
    expect(Notifications::NotifyThreadProjectEditorsJob).to receive(:perform_later).with(match_array([editor, project_editor, author]), any_args)
    comment = FactoryBot.create(:comment, subject: subject)
    described_class.run comment: comment
  end
end
