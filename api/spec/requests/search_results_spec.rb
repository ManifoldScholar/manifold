# frozen_string_literal: true

RSpec.describe "Search Results API", elasticsearch: true, type: :request do
  let_it_be(:bovary, refind: true) { FactoryBot.create :project, title: "Madame Bovary", description: "The force will be with you, always" }
  let_it_be(:babble, refind: true) { FactoryBot.create :project, title: "Madame Babble", description: "Peace be with you" }

  before do
    bovary && babble

    Project.reindex
    Project.searchkick_index.refresh
  end

  let!(:keyword) { raise "must be set" }

  let(:query_params) { { keyword: keyword } }

  def make_the_request!
    get api_v1_search_results_path(params: query_params)
  end

  def expect_valid_search!
    expect do
      make_the_request!
    end.not_to raise_error

    expect(response).to be_successful

    @body = response.parsed_body
  end

  context "when searching" do
    let(:keyword) { "madame -bovary" }

    it "returns the expected results" do
      expect_valid_search!

      expect(@body).to include_json(
        data: [{
          attributes: {
            searchableId: babble.id,
            searchableType: "project"
          }
        }],
        meta: {
          pagination: {
            totalCount: 1
          }
        }
      )
    end
  end

  context "when searching only a negated needle" do
    let(:keyword) { "-bovary" }

    it "returns no results" do
      expect_valid_search!

      expect(@body).to include_json(data: [], meta: { pagination: { totalCount: 0 } })
    end
  end

  context "when searching only a negated phrase" do
    let(:keyword) { %[-"the force"] }

    it "returns no results" do
      expect_valid_search!

      expect(@body).to include_json(data: [], meta: { pagination: { totalCount: 0 } })
    end
  end
end
