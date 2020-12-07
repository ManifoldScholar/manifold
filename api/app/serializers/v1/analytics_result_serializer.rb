module V1
  class AnalyticsResultSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :data, Types::Array.of(Types::Hash)

  end
end
