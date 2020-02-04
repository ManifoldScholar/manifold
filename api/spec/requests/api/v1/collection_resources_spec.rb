require "swagger_helper"

RSpec.describe "Collection Resource", type: :request do
  context "for a resource collection" do
    let(:resource) { FactoryBot.create(:collection_resource) }
    let(:resource_collection_id) { resource.resource_collection_id }

    path "/resource_collections/{resource_collection_id}/relationships/collection_resources" do
      include_examples "an API index request",
                       model: CollectionResource,
                       parent: "resource collection",
                       url_parameters: [:resource_collection_id],
                       included_relationships: [:resource],
                       paginated: true
    end

    path "/resource_collections/{resource_collection_id}/relationships/collection_resources/{id}" do
      include_examples "an API show request",
                       model: CollectionResource,
                       parent: "resource collection",
                       url_parameters: [:resource_collection_id],
                       included_relationships: [:resource]
    end
  end
end
