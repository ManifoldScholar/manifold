# frozen_string_literal: true

module V1
  class LtiRegistrationSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :name, Types::String
    typed_attribute :issuer, Types::String
    typed_attribute :client_id, Types::String
    typed_attribute :enabled, Types::Bool
    typed_attribute :lti_deployments_count, Types::Integer.meta(read_only: true) do |object|
      object.lti_deployments.size
    end
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
  end
end
