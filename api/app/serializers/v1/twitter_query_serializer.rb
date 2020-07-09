module V1
  class TwitterQuerySerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :updated_at, Types::DateTime.meta(read_only: true)
    typed_attribute :query, Types::String
    typed_attribute :active, Types::Bool
    typed_attribute :events_count, Types::Integer.meta(read_only: true)
    typed_attribute :result_type, Types::String.enum("most_recent", "popular")
    typed_attribute :display_name, Types::String.meta(read_only: true)

    typed_belongs_to :project

  end
end
