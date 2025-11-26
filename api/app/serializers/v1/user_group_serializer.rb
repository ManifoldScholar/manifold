# frozen_string_literal: true

module V1
  class UserGroupSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :name, Types::String.meta(example: "Manifold SAML users")

  end
end
