module V1
  class FlattenedCollaboratorSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :roles, Types::Array.of(Types::String)
    typed_attribute :maker_name, Types::String
    typed_belongs_to :maker, serializer: ::V1::MakerSerializer
    typed_belongs_to :collaboratable, polymorphic: true
    typed_attribute :collaborators, Types::Array.of(Types::Serializer::ID.meta(read_only: true))
  end
end
