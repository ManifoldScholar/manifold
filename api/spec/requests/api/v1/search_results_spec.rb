require "swagger_helper"

RSpec.describe "SearchResults API", elasticsearch: true, type: :request do
  path "/search_results" do
    let!(:project_1) { FactoryBot.create :project, title: "Needle" }

    let(:keyword) { "needle" }

    before do
      project_1.present?

      Project.reindex
      Project.searchkick_index.refresh      
    end

    include_examples "an API index request",
      resource_name: "SearchResult",
      exclude: %w[404],
      parameters: [{ name: "keyword", in: :query, type: :string }]
  end
end
