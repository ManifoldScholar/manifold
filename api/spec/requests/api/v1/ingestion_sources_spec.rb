require "swagger_helper"

RSpec.describe "Ingestion Sources", type: :request do
  let!(:text) { FactoryBot.create(:text) }
  let(:text_id) { text.id }

  path "/texts/{text_id}/relationships/ingestion_sources" do
    include_examples "an API index request",
                      parent: "text",
                      model: IngestionSource,
                      url_parameters: [:text_id]
  end
end
