# frozen_string_literal: true

module V1
  class EntitlementImportSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    ID = Types::Serializer::ID.meta(read_only: true)

    ENTITLEMENT_STATE_OPTIONS = EntitlementImportState.map(&:to_s)

    CURRENT_STATE = Types::Coercible::String.enum(*ENTITLEMENT_STATE_OPTIONS).meta(example: "pending", read_only: true)

    abilities

    typed_attribute :name, Types::String.meta(read_only: true)

    typed_attribute :file_name, Types::String.meta(read_only: true)

    typed_attribute :file_url, Types::String.meta(read_only: true)

    typed_attribute :current_state, CURRENT_STATE

    typed_attribute :messages, Types::Array.of(Types::String).meta(read_only: true)

    typed_has_many :entitlement_import_rows, serializer: ::V1::EntitlementImportRowSerializer, record_type: "entitlementImportRow"
  end
end
