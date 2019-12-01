FactoryBot.define do
  factory :collection_resource do
    resource_collection
    resource

    after(:build) do |collection_resource|
      collection_resource.resource_collection.project = collection_resource.resource.project
    end
  end
end
