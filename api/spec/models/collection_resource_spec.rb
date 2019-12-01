require "rails_helper"

RSpec.describe CollectionResource, type: :model do
  let(:project) { FactoryBot.create(:project) }
  let(:another_project) { FactoryBot.create(:project) }
  let(:collection) { FactoryBot.create(:resource_collection, project: project) }
  let(:resource) { FactoryBot.create(:resource, project: project) }

  it "has a valid factory" do
    collection_resource = FactoryBot.build(:collection_resource)
    expect(collection_resource).to be_valid
  end

  it "belongs to a collection" do
    collection_resource = FactoryBot.create(:collection_resource,
                                            resource_collection: collection,
                                            resource: resource)
    expect(collection_resource.resource_collection).to be_a ResourceCollection
  end

  it "belongs to a resource" do
    collection_resource = FactoryBot.create(:collection_resource,
                                            resource_collection: collection,
                                            resource: resource)
    expect(collection_resource.resource).to be_a Resource
  end

  it "is invalid if the resource and collection do not belong to the same project" do
    another_resource = FactoryBot.create(:resource, project: another_project)
    collection_resource = FactoryBot.build(:collection_resource,
                                           resource_collection: collection,
                                           resource: another_resource)
    collection.reload
    expect(collection_resource).to_not be_valid
  end
end
