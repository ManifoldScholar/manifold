# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Collection Resource", type: :request do
  context "for a resource collection" do
    let(:resource) { FactoryBot.create(:collection_resource) }
    let(:resource_collection_id) { resource.resource_collection_id }

    path "/resource_collections/{resource_collection_id}/relationships/collection_resources" do
      it_behaves_like "an API index request",
                       model: CollectionResource,
                       parent: "resource collection",
                       url_parameters: [:resource_collection_id],
                       included_relationships: [:resource],
                       paginated: true
    end

    path "/resource_collections/{resource_collection_id}/relationships/collection_resources/{id}" do
      it_behaves_like "an API show request",
                       model: CollectionResource,
                       parent: "resource collection",
                       url_parameters: [:resource_collection_id],
                       included_relationships: [:resource]
    end
  end
end
