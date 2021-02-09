module V1
  class UserCollectionSerializer < V1::ManifoldSerializer
    include V1::Concerns::ManifoldSerializer

    serialize_collection_attributes!
  end
end
