# frozen_string_literal: true

require "rails_helper"

RSpec.describe Journal, type: :model do
  context "with a draft journal" do
    let_it_be(:journal) { FactoryBot.create :journal, :as_draft }

    context "when a reader has been assigned as a project editor to an issue within the journal" do
      let_it_be(:reader) { FactoryBot.create :user, :reader }

      let_it_be(:project) do
        FactoryBot.create(:project).tap do |project|
          reader.add_role :project_editor, project
        end
      end

      let_it_be(:journal_issue) { FactoryBot.create :journal_issue, project: project, journal: journal }

      let_it_be(:other_project) { FactoryBot.create :project }

      let_it_be(:other_issue) { FactoryBot.create :journal_issue, journal: journal, project: other_project }

      describe ".with_read_ability" do
        it "can find the journal for the user" do
          expect(described_class.with_read_ability(reader)).to include journal
        end
      end

      describe ".with_update_ability" do
        it "does not find the journal for the user" do
          expect(described_class.with_update_ability(reader)).not_to include journal
        end
      end

      describe ".with_update_or_issue_update_ability" do
        it "can find the journal for the user" do
          expect(described_class.with_update_or_issue_update_ability(reader)).to include journal
        end
      end

      describe "#issues_nav" do
        let_it_be(:nav_entries) { journal.issues_nav(user: reader) }

        it "has the right number of issues_nav", :aggregate_failures do
          expect(nav_entries).to include project.to_nav_entry
          expect(nav_entries).not_to include other_project.to_nav_entry
        end
      end

      context "authorizer checks" do
        it "is readable at the instance level" do
          expect(journal).to be_readable_by reader
        end

        it "is drafts_readable at the instance level" do
          expect(journal).to be_drafts_readable_by reader
        end

        it "is drafts_readable at the class level" do
          expect(described_class).to be_drafts_readable_by reader
        end

        it "readable at the class level" do
          expect(described_class).to be_readable_by reader
        end
      end
    end
  end
end
