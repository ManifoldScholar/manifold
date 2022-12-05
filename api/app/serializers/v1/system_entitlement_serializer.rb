# frozen_string_literal: true

module V1
  # @see ::SystemEntitlement
  class SystemEntitlementSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :kind, Types::String.meta(read_only: true)
  end
end
