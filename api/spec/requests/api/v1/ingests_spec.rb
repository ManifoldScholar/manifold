require "swagger_helper"

RSpec.describe "Ingests API", type: :request do
  context "when an ingestion is triggered" do
    let!(:project) { FactoryBot.create(:project) }
    let!(:project_id) { project.id }
    let(:attributes) {
      {
        source: markdown_source_params,
        ingestionType: "epub"
      }
    }

    path "/projects/{project_id}/ingest" do
      include_examples "an API create request",
            model: Ingestion,
            parent: "project",
            url_parameters: [:project_id],
            authorized_user: :admin,
            included_relationships: [:creator] do
              let(:body) do
                {
                  data: {
                    attributes: attributes
                  }
                }
              end
            end
    end

    let!(:text) { FactoryBot.create(:text) }
    let(:text_id) { text.id }

    path "/texts/{text_id}/ingest" do
      include_examples "an API create request",
            model: Ingestion,
            parent: "text",
            url_parameters: [:text_id],
            authorized_user: :admin,
            included_relationships: [:creator] do
              let(:body) do
                {
                  data: {
                    attributes: attributes,
                    relationships: {}
                  }
                }
              end
            end
    end
  end
end
