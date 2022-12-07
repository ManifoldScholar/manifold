# frozen_string_literal: true

module V1
  class EntitlementSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    ID = Types::Serializer::ID.meta(read_only: true)

    ENTITLEMENT_STATE_OPTIONS = EntitlementState.map(&:to_s)
    CURRENT_STATE = Types::Coercible::String.enum(*ENTITLEMENT_STATE_OPTIONS).meta(example: "active", read_only: true)

    typed_belongs_to :entitler

    typed_belongs_to :subject, polymorphic: true
    typed_attribute :subject_id, ID
    typed_attribute :subject_type, Types::String.meta(example: "Project", read_only: true)
    typed_attribute :subject_url, Types::String.meta(
      example: "gid://entitlements/Project/d5dd1398-ab9c-426b-bebc-25a596e3ca1e"
    )

    typed_belongs_to :target, polymorphic: true
    typed_attribute :target_id, ID
    typed_attribute :target_name, Types::String.meta(example: "Maya Angelou", read_only: true)
    typed_attribute :target_type, Types::String.meta(example: "User", read_only: true)
    typed_attribute :target_url, Types::String.meta(
      example: "gid://manifold-api/User/18588cc5-7761-43d2-9d3f-6aaabb46a59a"
    )

    typed_attribute :current_state, CURRENT_STATE

    typed_attribute :expiration, Types::String.optional.meta(example: "2025-01-01")

    typed_attribute :role_names, Types::Array.of(Types::String).meta(example: %w[read_access], read_only: true) do |entitlement|
      entitlement.granted_role_names
    end

    typed_attribute :global_roles, Types::Coercible::Hash.schema(
      subscriber: Types::Bool
    ) do |entitlement|
      entitlement.global_roles.as_json
    end

    typed_attribute :scoped_roles, Types::Coercible::Hash.schema(
      read_access: Types::Bool
    ) do |entitlement|
      entitlement.scoped_roles.as_json
    end
  end
end
