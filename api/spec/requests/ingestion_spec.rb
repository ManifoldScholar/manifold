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
    let(:api_response) { response.parsed_body }

    before do
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

  describe "ingestion processing" do
    let!(:ingestion) { FactoryBot.create(:ingestion) }
    let!(:project_id) { ingestion.project_id }

    before do
      stub_request(:get, "http://example.com/index.md").
        to_return(status: 200, body: "", headers: {})
    end

    it "can start ingestion processing" do
      expect do
        post process_api_v1_ingestion_path(ingestion), headers: admin_headers
      end.to have_enqueued_job(::Ingestions::ProcessJob).once

      expect(response).to be_successful
    end

    it "can reingest an ingestion" do
      expect do
        post reingest_api_v1_ingestion_path(ingestion), headers: admin_headers
      end.to have_enqueued_job(::Ingestions::ReingestJob).once
      expect(response).to be_successful
    end

    it "can reset an ingestion" do
      ingestion.process(ingestion.creator)
      post reset_api_v1_ingestion_path(ingestion), headers: admin_headers
      expect(response).to be_successful
    end
  end
end
