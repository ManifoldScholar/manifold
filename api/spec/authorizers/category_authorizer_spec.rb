# frozen_string_literal: true

RSpec.describe "Category Abilities", :authorizer, :project_role_tests do
  let_it_be(:category, refind: true) { FactoryBot.create :category, project: project }

  let_it_be(:other_project, refind: true) { FactoryBot.create :project }
  let_it_be(:other_category) { FactoryBot.create :category, project: other_project }

  let(:object) { category }

  context "when the subject is an admin" do
    subject { admin }

    the_subject_behaves_like "instance abilities", Category, all: true
  end

  context "when the subject is an editor" do
    subject { editor }

    the_subject_behaves_like "instance abilities", Category, all: true
  end

  context "when the subject is a project_creator" do
    subject { project_creator }

    the_subject_behaves_like "instance abilities", Category, read_only: true
  end

  context "when the subject is a marketeer" do
    subject { marketeer }

    the_subject_behaves_like "instance abilities", Category, all: true
  end

  context "when the subject is a reader and project_editor of the category's project" do
    subject { project_editor }

    the_subject_behaves_like "instance abilities", Category, all: true
  end

  context "when the subject is a reader and project_editor of a different project" do
    let(:object) { other_category }

    subject { project_editor }

    the_subject_behaves_like "instance abilities", Category, read_only: true
  end

  context "when the subject is a reader and project_property_manager of the category's project" do
    subject { project_property_manager }

    the_subject_behaves_like "instance abilities", Category, read_only: true
  end

  context "when the subject is a reader and project_author of the category's project " do
    subject { project_author }

    the_subject_behaves_like "instance abilities", Category, read_only: true
  end

  context "when the subject is a reader" do
    subject { reader }

    the_subject_behaves_like "instance abilities", Category, read_only: true
  end
end
