# frozen_string_literal: true

module V1
  class UserGroupMembershipSerializer < ManifoldSerializer
    include V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :id, Types::Serializer::ID
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :name, Types::String.meta(example: "Manifold SAML users")

    typed_has_one :user, serializer: ::V1::UserSerializer, record_type: "user"
  end
end
