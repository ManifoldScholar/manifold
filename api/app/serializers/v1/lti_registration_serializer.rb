# frozen_string_literal: true

module V1
  class LtiRegistrationSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    abilities

    STATE_OPTIONS = LtiRegistrationState.map(&:to_s)
    CURRENT_STATE = Types::Coercible::String.enum(*STATE_OPTIONS).meta(example: "pending", read_only: true)

    typed_attribute :name, Types::String
    typed_attribute :issuer, Types::String
    typed_attribute :client_id, Types::String
    typed_attribute :current_state, CURRENT_STATE
    typed_attribute :lti_deployments_count, Types::Integer.meta(read_only: true) do |object|
      object.lti_deployments.size
    end
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
  end
end
