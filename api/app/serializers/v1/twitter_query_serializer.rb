module V1
  class TwitterQuerySerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    attributes :created_at,
               :updated_at,
               :query,
               :active,
               :events_count,
               :result_type,
               :display_name

    belongs_to :project
  end
end
