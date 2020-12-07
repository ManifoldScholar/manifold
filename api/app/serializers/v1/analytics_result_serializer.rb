module V1
  class AnalyticsResultSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :reports, Types::Array.of(Types::Hash).meta(read_only: true) do |object|
      object.reports.map { |r| camelize_hash(r) }
    end
    typed_attribute :start_date, Types::Date.meta(read_only: true)
    typed_attribute :end_date, Types::Date.meta(read_only: true)

  end
end
