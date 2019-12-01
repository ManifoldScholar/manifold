module V1
  class CollectionResourceSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    attributes :position,
               :resource_collection_id

    has_one :resource

  end
end
