# frozen_string_literal: true

RSpec.describe "Comment Abilities", :authorizer do
  let_it_be(:creator, refind: true) { FactoryBot.create(:user, :reader) }
  let_it_be(:object, refind: true) { FactoryBot.create(:comment, creator: creator) }

  context "when the subject is an anonymous user" do
    let_it_be(:subject) { AnonymousUser.new }

    the_subject_behaves_like "instance abilities", Comment, create: false, read: true, update: false, delete: false

    the_subject_behaves_like "class abilities", Comment, create: false, read: true, update: false, destroy: false
  end

  context "when the subject is an admin" do
    let_it_be(:subject, refind: true) { FactoryBot.create(:user, :admin) }

    the_subject_behaves_like "instance abilities", Comment, all: true
  end

  context "when the subject is an editor" do
    let_it_be(:subject, refind: true) { FactoryBot.create(:user, :editor) }

    the_subject_behaves_like "instance abilities", Comment, create: true, read: true, update: false, delete: true
  end

  context "when the subject is a reader" do
    let_it_be(:subject, refind: true) { FactoryBot.create(:user) }

    context "with a confirmed email" do
      before do
        subject.mark_email_confirmed!
      end

      the_subject_behaves_like "instance abilities", Comment, create: true, read: true, update: false, delete: false

      the_subject_behaves_like "class abilities", Comment, create: true, read: true, update: true, destroy: true

    end

    context "with an unconfirmed email" do
      before do
        subject.clear_email_confirmation!
      end

      the_subject_behaves_like "instance abilities", Comment, create: false, read: true, update: false, delete: false

      the_subject_behaves_like "class abilities", Comment, create: false, read: true, update: true, destroy: true
    end
  end

  context "when the subject is the resource creator" do
    let_it_be(:subject, refind: true) { creator }

    the_subject_behaves_like "instance abilities", Comment, read: true, update: true, destroy: true
  end

  context "when the comment is on an annotation in a closed project with disabled engagement" do
    let_it_be(:project, refind: true) { FactoryBot.create(:project, :with_restricted_access, disable_engagement: true ) }
    let_it_be(:user, refind: true) { FactoryBot.create(:user) }
    let_it_be(:reading_group, refind: true) { FactoryBot.create(:reading_group) }
    let_it_be(:reading_group_membership, refind: true) { FactoryBot.create(:reading_group_membership, reading_group: reading_group, user: user) }
    let_it_be(:entitlement, refind: true) { FactoryBot.create :entitlement, :read_access, :for_reading_group, target: reading_group.reload, subject: project }
    let_it_be(:text, refind: true) { FactoryBot.create(:text, project: project) }
    let_it_be(:annotation, refind: true) { FactoryBot.create(:annotation, creator: user, reading_group: reading_group, text: text) }
    let_it_be(:object, refind: true) { FactoryBot.create(:comment, creator: user, subject: annotation) }
    let_it_be(:subject, refind: true) { user.reload }

    context "with a confirmed email" do
      before do
        subject.mark_email_confirmed!
      end

      the_subject_behaves_like "instance abilities", Comment, all: true
    end

    context "with an unconfirmed email" do
      before do
        subject.clear_email_confirmation!
      end

      the_subject_behaves_like "instance abilities", Comment, create: false, read: true, update: true, destroy: true
    end
  end

  context "when the comment is for a project that has disabled engagement" do
    let_it_be(:subject, refind: true) { FactoryBot.create(:user) }
    let_it_be(:project, refind: true) { FactoryBot.create(:project, disable_engagement: true) }

    context "when the commment is on a resource" do
      let_it_be(:comment_subject, refind: true) { FactoryBot.create(:resource, project: project) }
      let_it_be(:object, refind: true) { FactoryBot.create(:comment, creator: creator, subject: comment_subject) }

      the_subject_behaves_like "instance abilities", Comment, none: true
    end

    context "when the commment is on an annotation" do
      let_it_be(:text, refind: true) { FactoryBot.create(:text, project: project) }
      let_it_be(:text_section, refind: true) { FactoryBot.create(:text_section, text: text) }
      let_it_be(:comment_subject, refind: true) { FactoryBot.create(:annotation, text_section: text_section) }
      let_it_be(:object, refind: true) { FactoryBot.create(:comment, creator: creator, subject: comment_subject) }

      context "with a confirmed email" do
        before do
          subject.mark_email_confirmed!
        end

        the_subject_behaves_like "instance abilities", Comment, { create: true, read: true, update: false, delete: false}
      end

      context "with an unconfirmed email" do
        before do
          subject.clear_email_confirmation!
        end

        the_subject_behaves_like "instance abilities", Comment, { create: false, read: true, update: false, delete: false}
      end
    end
  end
end
