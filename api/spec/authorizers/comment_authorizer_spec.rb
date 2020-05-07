require "rails_helper"

RSpec.describe "Comment Abilities", :authorizer do
  let(:creator) { FactoryBot.create(:user, :reader) }
  let(:object) { FactoryBot.create(:comment, creator: creator) }

  context "when the subject is an admin" do
    let(:subject) { FactoryBot.create(:user, :admin) }

    the_subject_behaves_like "instance abilities", Comment, all: true
  end

  context "when the subject is an editor" do
    let(:subject) { FactoryBot.create(:user, :editor) }

    abilities = { create: true, read: true, update: false, delete: true }
    the_subject_behaves_like "instance abilities", Comment, abilities
  end

  context "when the subject is a reader" do
    let(:subject) { FactoryBot.create(:user) }

    abilities = { create: true, read: true, update: false, delete: false }
    the_subject_behaves_like "instance abilities", Comment, abilities
  end

  context "when the subject is the resource creator" do
    let(:subject) { creator }

    the_subject_behaves_like "instance abilities", Comment, all: true
  end

  context "when the comment is for a project that has disabled engagement" do
    let(:subject) { FactoryBot.create(:user) }
    let(:project) { FactoryBot.create(:project, disable_engagement: true) }
    let(:object) { FactoryBot.create(:comment, creator: creator, subject: comment_subject) }

    context "when the commment is on a resource" do
      let(:comment_subject) { FactoryBot.create(:resource, project: project) }
      the_subject_behaves_like "instance abilities", Comment, none: true
    end

    context "when the commment is on an annotation" do
      let(:text) { FactoryBot.create(:text, project: project) }
      let(:text_section) { FactoryBot.create(:text_section, text: text) }
      let(:comment_subject) { FactoryBot.create(:annotation, text_section: text_section) }
      the_subject_behaves_like "instance abilities", Comment, none: true
    end
  end
end
