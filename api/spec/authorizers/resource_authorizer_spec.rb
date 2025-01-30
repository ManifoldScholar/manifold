# frozen_string_literal: true

RSpec.describe "Resource Abilities", :authorizer, :project_role_tests do
  let_it_be(:resource, refind: true) { FactoryBot.create(:resource, project: project) }

  let(:object) { resource }

  context "when the subject is an admin" do
    subject { admin }

    the_subject_behaves_like "instance abilities", Resource, all: true
  end

  context "when the subject is an editor" do
    subject { editor }

    the_subject_behaves_like "instance abilities", Resource, all: true
  end

  context "when the subject is a project_creator" do
    subject { project_creator }

    the_subject_behaves_like "instance abilities", Resource, read_only: true
  end

  context "when the subject is a marketeer" do
    subject { marketeer }

    the_subject_behaves_like "instance abilities", Resource, all: true
  end

  context "when the subject is a reader and project_editor of the resource's project" do
    subject { project_editor }

    the_subject_behaves_like "instance abilities", Resource, all: true
  end

  context "when the subject is a reader and project_property_manager of the resource's project" do
    subject { project_property_manager }

    the_subject_behaves_like "instance abilities", Resource, all: true
  end

  context "when the subject is a reader and project_author of the resource's project" do
    subject { project_author }

    the_subject_behaves_like "instance abilities", Resource, read_only: true
  end

  context "when the subject is a reader" do
    subject { reader }

    the_subject_behaves_like "instance abilities", Resource, read_only: true
  end

  include_examples "unauthenticated user", Resource
end
