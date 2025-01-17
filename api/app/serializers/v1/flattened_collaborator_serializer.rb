module V1
  class FlattenedCollaboratorSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :role, Types::String
  end
end
