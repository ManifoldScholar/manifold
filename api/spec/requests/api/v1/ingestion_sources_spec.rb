require "swagger_helper"

RSpec.describe "Ingestion Sources", type: :request do
  let!(:text) { FactoryBot.create(:text) }
  let(:text_id) { text.id }
  let(:attributes) { {
    attachment: image_params,
    kind: "publication_resource",
    source_identifier: "test"
  }}

  path "/texts/{text_id}/relationships/ingestion_sources" do
    include_examples "an API index request",
                      parent: "text",
                      model: IngestionSource,
                      url_parameters: [:text_id]

    include_examples "an API create request",
                     model: IngestionSource,
                     parent: :text,
                     url_parameters: [:text_id],
                     authorized_user: :admin do
              let(:body) do
                {
                  data: {
                    attributes: attributes
                  }
                }
              end
            end
  end

  path "/ingestion_sources/{id}" do
    include_examples "an API show request",
                     model: IngestionSource

    include_examples "an API update request",
                     model: IngestionSource,
                     authorized_user: :admin do
              let(:body) do
                {
                  data: {
                    attributes: attributes
                  }
                }
              end
            end

    include_examples "an API destroy request",
                     model: IngestionSource,
                     authorized_user: :admin
  end
end
