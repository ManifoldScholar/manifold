module V1
  class EntitlementSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :subject_id, Types::Serializer::ID.meta(read_only: true)
    typed_attribute :subject_type, Types::String.meta(example: "Project", read_only: true)
  end
end
