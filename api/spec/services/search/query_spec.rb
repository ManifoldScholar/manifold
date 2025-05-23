# frozen_string_literal: true

RSpec.describe Search::Query, interaction: true do
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
