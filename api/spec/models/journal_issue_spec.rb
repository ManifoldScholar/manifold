# frozen_string_literal: true

RSpec.describe JournalIssue, type: :model do
  describe ".with_read_ability" do
    let_it_be(:project, refind: true) { FactoryBot.create(:project) }
    let_it_be(:journal, refind: true) { FactoryBot.create(:journal) }
    let_it_be(:journal_issue, refind: true) do
      FactoryBot.create(:journal_issue, project:, journal:)
    end

    let_it_be(:admin, refind: true) do
      FactoryBot.create(:user, :admin)
    end

    let_it_be(:project_editor, refind: true) do
      FactoryBot.create(:user).tap do |user|
        user.add_role(:project_editor, project)
      end
    end

    let_it_be(:journal_editor, refind: true) do
      FactoryBot.create(:user).tap do |user|
        user.add_role(:journal_editor, journal)
      end
    end

    let_it_be(:regular_user, refind: true) { FactoryBot.create :user }

    let_it_be(:anonymous_user) { AnonymousUser.new }

    shared_examples_for "all access" do
      it "is visible to admins" do
        expect(described_class.with_read_ability(admin)).to include(journal_issue)
      end

      it "is visible to journal editors" do
        expect(described_class.with_read_ability(journal_editor)).to include(journal_issue)
      end

      it "is visible to project editors" do
        expect(described_class.with_read_ability(project_editor)).to include(journal_issue)
      end
    end

    shared_examples_for "public access" do
      it "is visible to regular users" do
        expect(described_class.with_read_ability(regular_user)).to include(journal_issue)
      end

      it "is visible to anonymous users", :aggregate_failures do
        expect(described_class.with_read_ability(nil)).to include(journal_issue)
        expect(described_class.with_read_ability(anonymous_user)).to include(journal_issue)
      end
    end

    shared_examples_for "restricted draft access" do
      it "is not visible to regular users" do
        expect(described_class.with_read_ability(regular_user)).not_to include(journal_issue)
      end

      it "is not visible to anonymous users", :aggregate_failures do
        expect(described_class.with_read_ability(nil)).not_to include(journal_issue)
        expect(described_class.with_read_ability(anonymous_user)).not_to include(journal_issue)
      end
    end

    context "when both project and journal are published" do
      it_behaves_like "all access"
      it_behaves_like "public access"
    end

    context "when the journal is a draft" do
      before do
        journal.update!(draft: true)
      end

      it_behaves_like "all access"
      it_behaves_like "restricted draft access"
    end

    context "when the project is a draft" do
      before do
        project.update!(draft: true)
      end

      it_behaves_like "all access"
      it_behaves_like "restricted draft access"
    end
  end
end
