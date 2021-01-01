module V1
  class AnalyticsEventSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :events, Types::Array.of(Types::Hash)
    typed_attribute :errors, Types::Array.of(Types::Hash)

  end
end
