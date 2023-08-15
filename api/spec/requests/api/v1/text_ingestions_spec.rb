require "swagger_helper"

RSpec.describe "Text Ingestions API", type: :request do
  context "when an ingestion is triggered" do
    let!(:text) { FactoryBot.create(:text) }
    let(:text_id) { text.id }
    let(:attributes) {
      {
        source: markdown_source_params,
        ingestionType: "epub"
      }
    }

    path "/texts/{text_id}/ingestions" do
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
