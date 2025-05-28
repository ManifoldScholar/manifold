# frozen_string_literal: true

module V1
  class IngestionMessageSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :kind, Types::String.meta(read_only: true)
    attribute :payload
    typed_attribute :created_at, Types::String.meta(read_only: true)
  end
end
