module V1
  class ProjectAnalyticsSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :events, Types::Hash.meta(read_only: true)

  end
end
