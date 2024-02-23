# frozen_string_literal: true

RSpec.describe "Annotation Abilities", :authorizer do
  let_it_be(:user) { FactoryBot.create(:user) }
  let_it_be(:creator) { FactoryBot.create(:user) }
  let_it_be(:project) { FactoryBot.create(:project, draft: false) }
  let_it_be(:text) { FactoryBot.create(:text, project: project, creator: creator) }
  let_it_be(:object) { FactoryBot.create(:annotation, :is_public, creator: creator, text: text) }

  context "when the subject is an anonymous user" do
    let_it_be(:subject) { anonymous_user }

    abilities = { create: false, read: true, update: false, delete: false }

    the_subject_behaves_like "instance abilities", Annotation, abilities
  end

  context "when the subject is an admin" do
    let_it_be(:subject, refind: true) { FactoryBot.create(:user, :admin) }

    the_subject_behaves_like "instance abilities", Annotation, all: true
  end

  context "when the subject is an editor" do
    let_it_be(:subject, refind: true) { FactoryBot.create(:user, :editor) }

    the_subject_behaves_like "instance abilities", Annotation, all: true
  end

  context "when the subject is a resource editor for the annotation's project" do
    let_it_be(:subject) do
      FactoryBot.create(:user).tap do |user|
        user.add_role :project_editor, project
      end
    end

    context "when the annotation is a text annotation created by another user" do
      abilities = { create: true, read: true, update: false, delete: false }
      the_subject_behaves_like "instance abilities", Annotation, abilities
    end

    context "when the annotation is a resource annotation created by another user" do
      let_it_be(:object, refind: true) do
        FactoryBot.create(:resource_annotation, :is_public, creator: creator, text: text)
      end
      abilities = { create: true, read: true, update: true, delete: true }
      the_subject_behaves_like "instance abilities", Annotation, abilities
    end
  end

  context "when the subject is a reader" do
    context "when the annotation is a resource annotation created by another user" do
      let_it_be(:object, refind: true) do
        FactoryBot.create(:resource_annotation, creator: creator, private: false, text: text)
      end

      let_it_be(:subject) { user }

      abilities = { create: false, read: true, update: false, delete: false }

      the_subject_behaves_like "instance abilities", Annotation, abilities
    end
  end

  context "when the subject is the resource creator" do
    let_it_be(:subject, refind: true) { creator }

    abilities = { read: true, update: true, delete: true }

    the_subject_behaves_like "instance abilities", Annotation, abilities
  end

  context "when the annotation belongs to a private reading group" do
    let_it_be(:reading_group, refind: true) { FactoryBot.create(:reading_group, :is_private) }

    let_it_be(:object, refind: true) do
      FactoryBot.create(:annotation, :is_public, creator: creator, reading_group: reading_group, text: text)
    end

    context "when the reader belongs to the annotation group" do
      before do
        FactoryBot.create(:reading_group_membership, reading_group: reading_group, user: user)

        reading_group.reload
      end

      let_it_be(:subject, refind: true) { user }

      context "with a confirmed email" do
        before do
          subject.mark_email_confirmed!
        end

        abilities = { create: true, read: true, update: false, delete: false }
        the_subject_behaves_like "instance abilities", Annotation, abilities
      end

      context "with an unconfirmed email" do
        before do
          subject.clear_email_confirmation!
        end

        abilities = { create: true, read: true, update: false, delete: false }

        the_subject_behaves_like "instance abilities", Annotation, abilities

        context "when the subject is the resource creator" do
          before do
            FactoryBot.create(:reading_group_membership, reading_group: reading_group, user: creator)

            reading_group.reload
          end

          let_it_be(:subject, refind: true) { creator }

          abilities = { create: true, read: true, update: true, delete: true }

          the_subject_behaves_like "instance abilities", Annotation, abilities
        end

      end
    end

    context "when the reader does not belong to the annotation group" do
      let_it_be(:subject) { user }
      abilities = { create: false, read: false, update: false, delete: false }
      the_subject_behaves_like "instance abilities", Annotation, abilities
    end
  end

  context "when the annotation belongs to a public reading group" do
    let_it_be(:reading_group) { FactoryBot.create(:reading_group, privacy: "public") }
    let_it_be(:object, refind: true) do
      FactoryBot.create(:annotation, :is_public, creator: creator, reading_group: reading_group, text: text)
    end
    let_it_be(:subject, refind: true) { user }

    context "when the reader belongs to the annotation group" do
      before do
        FactoryBot.create(:reading_group_membership, reading_group: reading_group, user: user)

        reading_group.reload
      end

      context "with a confirmed email" do
        before do
          subject.mark_email_confirmed!
        end

        abilities = { create: true, read: true, update: false, delete: false }

        the_subject_behaves_like "instance abilities", Annotation, abilities
      end

      context "with an unconfirmed email" do
        before do
          subject.clear_email_confirmation!
        end

        abilities = { create: false, read: true, update: false, delete: false }

        the_subject_behaves_like "instance abilities", Annotation, abilities
      end

      context "when reading groups are disabled" do
        let_it_be(:object) do
          FactoryBot.create(:annotation, creator: user, private: false, reading_group: reading_group, text: text)
        end

        abilities = { create: false, read: false, update: false, delete: true }

        before do
          settings = Settings.instance
          settings.general.disable_reading_groups = true
          settings.save!
        end

        the_subject_behaves_like "instance abilities", Annotation, abilities
      end
    end

    context "when the reader does not belong to the annotation group" do
      abilities = { create: false, read: true, update: false, delete: false }

      the_subject_behaves_like "instance abilities", Annotation, abilities
    end
  end

  context "when the subject is a reader with a confirmed email address" do
    before do
      subject.mark_email_confirmed!
    end

    context "when annotation is public" do
      let_it_be(:subject, refind: true) { user }

      abilities = { create: true, read: true, update: false, delete: false }

      the_subject_behaves_like "instance abilities", Annotation, abilities
    end

    context "when annotation is private" do
      let_it_be(:subject, refind: true) { user }
      let_it_be(:object, refind: true) { FactoryBot.create(:annotation, :is_private, creator: creator) }

      abilities = { create: true, read: false, update: false, delete: false }

      the_subject_behaves_like "instance abilities", Annotation, abilities
    end
  end
end
