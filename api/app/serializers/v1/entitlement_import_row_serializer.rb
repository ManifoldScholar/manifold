# frozen_string_literal: true

module V1
  class EntitlementImportRowSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    ID = Types::Serializer::ID.meta(read_only: true)

    ENTITLEMENT_STATE_OPTIONS = EntitlementImportRowState.map(&:to_s)

    CURRENT_STATE = Types::Coercible::String.enum(*ENTITLEMENT_STATE_OPTIONS).meta(example: "pending", read_only: true)

    typed_attribute :line_number, Types::Integer.meta(read_only: true)

    typed_belongs_to :subject, polymorphic: true
    typed_attribute :subject_id, ID
    typed_attribute :subject_type, Types::String.meta(example: "Project", read_only: true)

    typed_belongs_to :target, polymorphic: true
    typed_attribute :target_id, ID
    typed_attribute :target_type, Types::String.meta(example: "User", read_only: true)

    typed_attribute :current_state, CURRENT_STATE

    typed_attribute :expires_on, Types::Date.optional.meta(read_only: true, example: "2025-01-01")

    typed_attribute :messages, Types::Array.of(Types::String).meta(read_only: true)

    typed_belongs_to :entitlement
  end
end
