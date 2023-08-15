require "swagger_helper"

RSpec.describe "Project Ingestions API", type: :request do
  context "when an ingestion is triggered" do
    let!(:project) { FactoryBot.create(:project) }
    let!(:project_id) { project.id }
    let(:attributes) {
      {
        source: markdown_source_params,
        ingestionType: "epub"
      }
    }

    path "/projects/{project_id}/ingestions" do
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
  end
end
