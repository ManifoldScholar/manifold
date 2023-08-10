require "rails_helper"

RSpec.describe "Projects API", type: :request do
  include_context("authenticated request")
  include_context("param helpers")

  let!(:project) { FactoryBot.create(:project, draft: false) }
  let(:project_id) { project.id }

  let!(:attributes) {
    {
      source: markdown_source_params,
      ingestionType: "epub"
    }
  }
  let!(:valid_params) {
    build_json_payload(attributes: attributes)
  }

  context "when a text ingest is triggered" do
    let!(:path) { "/api/v1/projects/#{project_id}/ingest" }

    before(:each) do
      post path, headers: admin_headers, params: valid_params
    end

    it "creates and processes an ingestion" do
      expect(response).to have_http_status(201)
    end
  end

  let!(:text) { FactoryBot.create(:text) }
  let(:text_id) { text.id }

  context "when a text section ingest is triggered" do
    let!(:path) { "/api/v1/texts/#{text_id}/ingest" }

    before(:each) do
      post path, headers: admin_headers, params: valid_params
    end

    it "creates and processes an ingestion" do
      expect(response).to have_http_status(201)
    end
  end

end
