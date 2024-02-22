# frozen_string_literal: true

RSpec.describe "Ingestions API", type: :request do
  let(:attributes) do
    {
      source: markdown_source_params,
      ingestionType: "epub"
    }
  end

  let(:valid_params) do
    build_json_payload(attributes: attributes)
  end

  describe "creates an ingestion" do
    let(:project) { FactoryBot.create(:project) }
    let(:path) { api_v1_project_relationships_ingestions_path(project) }
    let(:api_response) { JSON.parse(response.body) }

    before(:each) do
      post path, headers: admin_headers, params: valid_params
    end

    it "sets the creator correctly" do
      expect(api_response["data"]["attributes"]["creatorId"]).to eq(admin.id)
    end

    it "sets the state correctly" do
      expect(api_response["data"]["attributes"]["state"]).to eq("sleeping")
    end

    it "accepts a valid source file upload and adds it to the ingestion" do
      file = api_response["data"]["attributes"]["sourceFileName"]
      expect(file).to eq "something.md"
    end
  end
end
