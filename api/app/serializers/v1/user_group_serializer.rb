# frozen_string_literal: true

module V1
  class UserGroupSerializer < ManifoldSerializer
    include V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :id, Types::Serializer::ID
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :name, Types::String.meta(example: "Manifold SAML users")
    typed_attribute :external_identifier, Types::String

    typed_has_many :users, serializer: ::V1::UserSerializer, record_type: "user"
    typed_has_many :entitlement_subjects,
                   serializer: ::V1::EntitlementSubjectSerializer,
                   polymorphic: true
  end
end
