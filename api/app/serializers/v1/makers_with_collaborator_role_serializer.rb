module V1
  class MakersWithCollaboratorRoleSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :first_name, Types::String.meta(description: "Requires at least one of these fields")
    typed_attribute :last_name, Types::String.meta(description: "Requires at least one of these fields")
    typed_attribute :middle_name, Types::String.optional
    typed_attribute :display_name, Types::String.optional
    typed_attribute :full_name, Types::String
    typed_attribute :role, Types::String
    typed_attribute :priority, Types::Integer
    typed_attribute :importance, Types::Integer
  end
end
