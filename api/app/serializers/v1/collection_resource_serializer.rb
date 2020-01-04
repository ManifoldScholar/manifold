module V1
  class CollectionResourceSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :position, Types::Integer
    typed_attribute :resource_collection_id, Types::Serializer::ID
    typed_has_one :resource

  end
end
