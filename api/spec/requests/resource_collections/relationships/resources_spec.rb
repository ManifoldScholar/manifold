# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Collection Resources API", type: :request do
  before do
    @collection = FactoryBot.create(:resource_collection)
    @resource = FactoryBot.create(:resource, project: @collection.project)
    @collection_resource = FactoryBot.create(:collection_resource, resource: @resource, resource_collection: @collection)
  end

  describe "sends a list of resources in a collection" do
    describe "the response" do
      it "has a 200 status code" do
        get api_v1_resource_collection_relationships_resources_path(@collection)
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "sends a single resource" do
    describe "the response" do
      it "has a 200 status code" do
        get api_v1_resource_collection_relationships_collection_resource_path(@collection, @collection_resource)
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
