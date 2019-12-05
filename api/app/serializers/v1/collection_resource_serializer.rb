module V1
  class CollectionResourceSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :position, NilClass
    typed_attribute :resource_collection_id, NilClass
    typed_has_one :resource

  end
end
