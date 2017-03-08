require "rails_helper"

RSpec.describe CollectionResource, type: :model do

  let(:project) { FactoryGirl.create(:project) }
  let(:another_project) { FactoryGirl.create(:project) }
  let(:collection) { FactoryGirl.create(:collection, project: project) }
  let(:resource) { FactoryGirl.create(:resource, project: project) }

  it "belongs to a collection" do
    collection_resource= FactoryGirl.create(:collection_resource,
                                            collection: collection,
                                            resource: resource)
    expect(collection_resource.collection).to be_a Collection
  end

  it "belongs to a resource" do
    collection_resource= FactoryGirl.create(:collection_resource,
                                            collection: collection,
                                            resource: resource)
    expect(collection_resource.resource).to be_a Resource
  end

  it "is invalid if the resource and collection do not belong to the same project" do
    another_resource = FactoryGirl.create(:resource, project: another_project)
    collection_resource= FactoryGirl.build(:collection_resource,
                                            collection: collection,
                                            resource: another_resource)
    expect(collection_resource).to_not be_valid
  end

end
