# frozen_string_literal: true

RSpec.describe "Text Abilities", :authorizer, :project_role_tests do # rubocop:todo RSpec/DescribeClass
  let_it_be(:text, refind: true) { FactoryBot.create(:text, project: project) }

  let(:object) { text }

  context "when the subject is a reader and project_editor of the text's project" do
    subject { project_editor }

    the_subject_behaves_like "instance abilities", Text, all: true

    it { is_expected.to be_able_to(:notate).on(text) }
  end

  context "when the subject is a reader and project_property_manager of the text's project" do
    subject { project_property_manager }

    the_subject_behaves_like "instance abilities", Text, all: true

    it { is_expected.to be_able_to(:notate).on(text) }
  end

  context "when the subject is a reader and project_author of the text's project" do
    subject { project_author }

    the_subject_behaves_like "instance abilities", Text, read_only: true

    it { is_expected.to be_able_to(:notate).on(text) }
  end

  context "when the subject is a reader" do
    subject { reader }

    the_subject_behaves_like "instance abilities", Text, read_only: true

    it { is_expected.to be_unable_to(:notate).on(text) }
  end

  context "when the user tries to access a text belonging to a restricted project" do
    before do
      project.update!(restricted_access: true)

      text.reload
    end

    context "an admin" do
      subject { admin }

      it { is_expected.to be_able_to(:read).on(text) }
    end

    context "a regular reader" do
      subject { reader }

      it { is_expected.to be_unable_to(:read).on(text) }
    end
  end

  include_examples "unauthenticated user", Text
end
