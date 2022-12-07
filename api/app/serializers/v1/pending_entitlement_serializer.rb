# frozen_string_literal: true

module V1
  # @see PendingEntitlement
  class PendingEntitlementSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    ID = Types::Serializer::ID.meta(read_only: true)

    ENTITLEMENT_STATE_OPTIONS = PendingEntitlementState.map(&:to_s)

    CURRENT_STATE = Types::Coercible::String.enum(*ENTITLEMENT_STATE_OPTIONS).meta(example: "pending", read_only: true)

    typed_belongs_to :entitlement

    typed_belongs_to :user

    typed_belongs_to :subject, polymorphic: true
    typed_attribute :subject_id, ID.meta(read_only: true)
    typed_attribute :subject_type, Types::String.meta(example: "Project", read_only: true)
    typed_attribute :subject_url, Types::String.meta(
      example: "gid://entitlements/Project/d5dd1398-ab9c-426b-bebc-25a596e3ca1e",
      read_only: true
    )

    typed_attribute :email, Types::String.meta(example: "user@example.org")
    typed_attribute :first_name, Types::String.optional.meta(example: "Maya")
    typed_attribute :last_name, Types::String.optional.meta(example: "Angelou")

    typed_attribute :current_state, CURRENT_STATE

    typed_attribute :expiration, Types::String.optional.meta(example: "in 1 year")
    typed_attribute :expires_on, Types::Date.optional.meta(read_only: true, example: "2025-01-01")

    typed_attribute :messages, Types::Array.of(Types::String).meta(read_only: true)
  end
end
