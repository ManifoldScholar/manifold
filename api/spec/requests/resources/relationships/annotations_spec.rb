# frozen_string_literal: true

RSpec.describe "Text Tracks API", type: :request do
  let!(:project) { FactoryBot.create(:project) }
  let!(:resource) { FactoryBot.create(:resource, project: project) }
  let!(:annotation) { FactoryBot.create(:annotation, resource: resource) }

  base_path = "/api/v1/resources/:resource_id/relationships/annotations"

  let(:path) { api_v1_resource_relationships_annotations_path(resource_id: resource.id) }

  describe "GET #{base_path}" do
    it "returns a list of text tracks" do
      get path
      expect(response).to have_http_status(:ok)
    end
  end
end
