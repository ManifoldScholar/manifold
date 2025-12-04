# frozen_string_literal: true

module V1
  class UserGroupEntitleableSerializer < ManifoldSerializer
    include V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :id, Types::Serializer::ID
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)

    typed_has_one :entitleable,
                   serializer: ::V1::EntitlementSubjectSerializer,
                   polymorphic: true
  end
end
