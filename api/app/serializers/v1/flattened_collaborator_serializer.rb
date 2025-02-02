module V1
  class FlattenedCollaboratorSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :roles, Types::Array.of(Types::String)
    typed_belongs_to :maker
    typed_belongs_to :collaboratable, polymorphic: true
  end
end
