# frozen_string_literal: true

RSpec.describe "Project Ingestions API", type: :request do
  let!(:project) { FactoryBot.create(:project, draft: false) }
  let(:project_id) { project.id }

  let!(:attributes) do
    {
      source: markdown_source_params,
      ingestionType: "epub"
    }
  end

  let!(:valid_params) do
    build_json_payload(attributes: attributes)
  end

  let!(:path) { api_v1_project_ingestions_path(project) }

  it "creates and processes an ingestion" do
    expect do
      post path, headers: admin_headers, params: valid_params
    end.to change(Ingestion, :count).by(1)

    expect(response).to have_http_status(:created)
  end
end
