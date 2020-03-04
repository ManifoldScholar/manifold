require "rails_helper"

RSpec.describe Notifications::FetchUsersForCommentNotification do
  let(:project) { FactoryBot.create(:project) }
  let(:text) { FactoryBot.create(:text, project: project) }
  let(:text_section) { FactoryBot.create(:text_section, text: text) }
  let(:subject) { FactoryBot.create(:annotation, text_section: text_section)}
  let(:editor) { FactoryBot.create(:user, :editor) }
  let(:project_editor) { FactoryBot.create(:user) }
  let(:author) { FactoryBot.create(:user) }
  let(:comment) { FactoryBot.create(:comment, subject: subject)}

  before(:each) do
    editor.update(notification_preferences_by_kind: { project_comments_and_annotations: NotificationFrequency[:always] })
    author.add_role(:project_author, project)
    project_editor.add_role(:project_editor, project)
    author.update(notification_preferences_by_kind: { project_comments_and_annotations: NotificationFrequency[:always] })
    project_editor.update(notification_preferences_by_kind: { project_comments_and_annotations: NotificationFrequency[:always] })
  end

  it "the returned users includes the editor" do
    outcome = described_class.run comment: comment
    expect(outcome.result.include? editor).to be true
  end

  it "the returned users includes the project editor" do
    outcome = described_class.run comment: comment
    expect(outcome.result.include? project_editor).to be true
  end

  it "the returned users includes the author" do
    outcome = described_class.run comment: comment
    expect(outcome.result.include? author).to be true
  end

  it "the returned users does not include the editor if the editor is the comment author" do
    comment = FactoryBot.create(:comment, subject: subject, creator: editor)
    outcome = described_class.run comment: comment
    expect(outcome.result.include? editor).to be false
  end

  it "the returned users does not include the project editor if the editor is the comment author" do
    comment = FactoryBot.create(:comment, subject: subject, creator: project_editor)
    outcome = described_class.run comment: comment
    expect(outcome.result.include? project_editor).to be false
  end

  it "the returned users does not include the author if the editor is the comment author" do
    comment = FactoryBot.create(:comment, subject: subject, creator: author)
    outcome = described_class.run comment: comment
    expect(outcome.result.include? author).to be false
  end
end
