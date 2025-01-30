# frozen_string_literal: true

RSpec.describe "Maker Abilities", :authorizer, :project_role_tests do
  let_it_be(:maker, refind: true) { FactoryBot.create :maker }
  let_it_be(:collaborator, refind: true) { FactoryBot.create :collaborator, maker: maker, collaboratable: project }
  let_it_be(:orphaned_maker) { FactoryBot.create :maker }

  let(:object) { maker }

  context "when the subject is an admin" do
    subject { admin }

    the_subject_behaves_like "instance abilities", Maker, all: true
  end

  context "when the subject is an editor" do
    subject { editor }

    the_subject_behaves_like "instance abilities", Maker, all: true
  end

  context "when the subject is a project_creator" do
    subject { project_creator }

    the_subject_behaves_like "instance abilities", Maker, none: true
  end

  context "when the subject is a marketeer" do
    subject { marketeer }

    the_subject_behaves_like "instance abilities", Maker, all: true

    context "when the maker is orphaned" do
      let(:object) { orphaned_maker }

      the_subject_behaves_like "instance abilities", Maker, all: true
    end
  end

  context "when the subject is a reader and project_editor of a maker's project" do
    subject { project_editor }

    the_subject_behaves_like "instance abilities", Maker, all: true
  end

  context "when the subject is a reader and project_editor, but not of the maker's project" do
    subject { project_editor }

    let(:object) { orphaned_maker }

    the_subject_behaves_like "instance abilities", Maker, none: true
  end

  context "when the subject is a reader and project_property_manager of a maker's project" do
    subject { project_property_manager }

    the_subject_behaves_like "instance abilities", Maker, none: true
  end

  context "when the subject is a reader and project_author of a maker's project" do
    subject { project_author }

    the_subject_behaves_like "instance abilities", Maker, none: true
  end

  context "when the subject is a reader" do
    subject { reader }

    the_subject_behaves_like "instance abilities", Maker, none: true
  end
end
