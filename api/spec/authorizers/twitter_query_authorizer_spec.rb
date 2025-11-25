# frozen_string_literal: true

RSpec.describe "Twitter Query Abilities", :authorizer, :project_role_tests do
  let_it_be(:twitter_query, refind: true) { FactoryBot.create :twitter_query, project: project }

  let(:object) { twitter_query }

  context "when the subject is an admin" do
    subject { admin }

    the_subject_behaves_like "instance abilities", TwitterQuery, all: true
  end

  context "when the subject is an editor" do
    subject { editor }

    the_subject_behaves_like "instance abilities", TwitterQuery, all: true
  end

  context "when the subject is a project_creator" do
    subject { project_creator }

    the_subject_behaves_like "instance abilities", TwitterQuery, none: true
  end

  context "when the subject is a marketeer" do
    subject { marketeer }

    the_subject_behaves_like "instance abilities", TwitterQuery, all: true
  end

  context "when the subject is a reader and project_editor of the twitter query's project" do
    subject { project_editor }

    the_subject_behaves_like "instance abilities", TwitterQuery, all: true
  end

  context "when the subject is a reader and project_property_manager of the twitter query's project" do
    subject { project_property_manager }

    the_subject_behaves_like "instance abilities", TwitterQuery, none: true
  end

  context "when the subject is a reader and project_author of a specific twitter_query" do
    subject { project_author }

    the_subject_behaves_like "instance abilities", TwitterQuery, none: true
  end

  context "when the subject is a reader" do
    subject { reader }

    the_subject_behaves_like "instance abilities", TwitterQuery, none: true
  end
end
