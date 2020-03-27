module V1
  class EntitlementTargetSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    ID = Types::Serializer::ID.meta(read_only: true)

    set_id :target_url

    typed_attribute :name, Types::String.meta(example: "Rashi", read_only: true)

    typed_attribute :target_id, ID
    typed_attribute :target_type, Types::String.meta(example: "User", read_only: true)
    typed_attribute :target_url, Types::String.meta(
      example: "gid://manifold-api/User/18588cc5-7761-43d2-9d3f-6aaabb46a59a",
      read_only: true
    )
  end
end
