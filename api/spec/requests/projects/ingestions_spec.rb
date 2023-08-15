require "rails_helper"

RSpec.describe "Project Ingestions API", type: :request do
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

  let!(:path) { api_v1_project_ingestions_path(project) }

  it "creates and processes an ingestion" do
    expect do
      post path, headers: admin_headers, params: valid_params
    end.to change(Ingestion, :count).by(1)

    expect(response).to have_http_status(:created)
  end
end
