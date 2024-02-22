# frozen_string_literal: true

RSpec.describe "Text Ingestions API", type: :request do
  let!(:text) { FactoryBot.create(:text) }
  let(:text_id) { text.id }

  let!(:attributes) do
    {
      source: markdown_source_params,
      ingestionType: "epub"
    }
  end

  let!(:valid_params) do
    build_json_payload(attributes: attributes)
  end

  let!(:path) { api_v1_text_ingestions_path(text) }

  it "creates and processes an ingestion" do
    expect do
      post path, headers: admin_headers, params: valid_params
    end.to change(Ingestion, :count).by(1)

    expect(response).to have_http_status(:created)
  end
end
