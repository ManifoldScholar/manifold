require "rails_helper"

RSpec.describe Notifications::FetchUsersForAnnotationNotification, interaction: true do
  let!(:project) { FactoryBot.create(:project) }
  let!(:text) { FactoryBot.create(:text, project: project) }
  let!(:text_section) { FactoryBot.create(:text_section, text: text) }

  let!(:editor) do
    FactoryBot.create(:user, :editor).tap do |editor|
      editor.update(notification_preferences_by_kind: { project_comments_and_annotations: NotificationFrequency[:always] })
    end
  end

  let!(:project_editor) do
    FactoryBot.create(:user).tap do |pe|
      pe.add_role(:project_editor, project)
      pe.update(notification_preferences_by_kind: { project_comments_and_annotations: NotificationFrequency[:always] })
    end
  end

  let(:annotation_traits) { [:is_public] }
  let(:annotation_attributes) do
    {
      text_section: text_section
    }
  end

  let_input!(:annotation) { FactoryBot.create :annotation, *annotation_traits, **annotation_attributes }

  context "for a public annotation" do
    it "should fetch the editor and project editor" do
      perform_within_expectation!

      expect(@outcome.result).to contain_exactly editor, project_editor
    end
  end

  context "for a private annotation" do
    let(:annotation_traits) { [:is_private] }

    it "should return no users" do
      perform_within_expectation!

      expect(@outcome.result).to be_blank
    end
  end
end
