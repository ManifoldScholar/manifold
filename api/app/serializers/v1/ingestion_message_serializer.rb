# frozen_string_literal: true

module V1
  class IngestionMessageSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :kind, Types::String.meta(read_only: true)
    typed_attribute :payload, Types::Any.meta(read_only: true)
    typed_attribute :id, Types::Serializer::ID
    typed_attribute :created_at, Types::String.meta(read_only: true)
  end
end
