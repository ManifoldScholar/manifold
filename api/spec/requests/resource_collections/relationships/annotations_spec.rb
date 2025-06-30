# frozen_string_literal: true

RSpec.describe "Resource Collection Annotations API", type: :request do
  let!(:project) { FactoryBot.create(:project) }
  let!(:resource_collection) { FactoryBot.create(:resource_collection, project: project) }
  let!(:annotation) { FactoryBot.create(:annotation, resource_collection: resource_collection) }

  base_path = "/api/v1/resource_collections/:resource_collection_id/relationships/annotations"

  let(:path) { api_v1_resource_collection_relationships_annotations_path(resource_collection_id: resource_collection.id) }

  describe "GET #{base_path}" do
    it "returns a list of annotations" do
      get path
      expect(response).to have_http_status(:ok)
    end
  end
end
