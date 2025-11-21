# frozen_string_literal: true

module V1
  class EntitlementSubjectSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :id, Types::Serializer::ID
    typed_attribute :title, Types::String.meta(read_only: true)
    typed_attribute :type, Types::String.meta(read_only: true) do |object|
      object.class.name.camelize(:lower)
    end
  end
end
