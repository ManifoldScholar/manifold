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

  context "when the comment is on an annotation in a closed project with disabled engagement" do
    let!(:project) { FactoryBot.create(:project, :with_restricted_access, disable_engagement: true ) }
    let!(:user) { FactoryBot.create(:user) }
    let!(:reading_group) { FactoryBot.create(:reading_group)}
    let!(:reading_group_membership) { FactoryBot.create(:reading_group_membership, reading_group: reading_group, user: user)}
    let!(:entitlement) { FactoryBot.create :entitlement, :project_read_access, :for_reading_group, target: reading_group.reload, subject: project }
    let(:text) { FactoryBot.create(:text, project: project) }
    let(:annotation) { FactoryBot.create(:annotation, creator: user, reading_group: reading_group, text: text) }
    let!(:object) { FactoryBot.build(:comment, creator: user, subject: annotation) }
    let!(:subject) { user.reload }
    # abilities = { create: true, read: true, update: true, delete: true }
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
      the_subject_behaves_like "instance abilities", Comment, { create: true, read: true, update: false, delete: false}
    end
  end
end
