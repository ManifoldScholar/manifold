# frozen_string_literal: true

RSpec.describe Search::Query, interaction: true do
  context "when dealing with journal faceting" do
    let_it_be(:journal, refind: true) { FactoryBot.create :journal, title: "Science Journal" }

    let_it_be(:regular_project, refind: true) { FactoryBot.create :project, title: "Non Journaled Project" }
    let_it_be(:journal_project, refind: true) do
      FactoryBot.create(
        :project,
        journal:,
        title: "Journaled Project"
      )
    end

    let_input!(:keyword) { "journal" }

    context "when faceting by 'Project'" do
      it "excludes journal-associated projects", :aggregate_failures do
        perform_within_expectation! facets: ["Project"]

        expect(@outcome.result.map(&:searchable)).to contain_exactly(regular_project).and(exclude(journal_project))
      end
    end

    context "when faceting by 'Journal'" do
      it "includes only journal-associated projects", :aggregate_failures do
        perform_within_expectation! facets: ["Journal"]

        expect(@outcome.result.map(&:searchable)).to contain_exactly(journal_project, journal).and(exclude(regular_project))
      end
    end
  end

  context "when dealing with draft content" do
    let_it_be(:project, refind: true) { FactoryBot.create :project, title: "Testing Project" }
    let_it_be(:text, refind: true) { FactoryBot.create :text, project:, title: "Testing Text" }
    let_it_be(:draft_project, refind: true) { FactoryBot.create :project, :as_draft, title: "Draft Testing Project" }
    let_it_be(:draft_text, refind: true) { FactoryBot.create :text, title: "Draft Testing Text", project: draft_project }

    let_input!(:keyword) { "testing" }

    it "excludes drafts", :aggregate_failures do
      perform_within_expectation!

      expect(@outcome.result.map(&:searchable)).to contain_exactly project, text

      perform_within_expectation! keyword: "draft"

      expect(@outcome.result.map(&:searchable)).to exclude(draft_project).and(exclude(draft_text))
    end
  end
end
