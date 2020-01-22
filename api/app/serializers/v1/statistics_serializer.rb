module V1
  class StatisticsSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :readers_this_week, Types::Float.meta(read_only: true)
    typed_attribute :reader_increase, Types::Integer.meta(read_only: true)
    typed_attribute :new_highlights_count, Types::Integer.meta(read_only: true)
    typed_attribute :new_annotations_count, Types::Integer.meta(read_only: true)
    typed_attribute :new_texts_count, Types::Integer.meta(read_only: true)
    typed_attribute :total_text_count, Types::Integer.meta(read_only: true)
    typed_attribute :total_resource_count, Types::Integer.meta(read_only: true)
    typed_attribute :total_annotation_count, Types::Integer.meta(read_only: true)
    typed_attribute :total_comment_count, Types::Integer.meta(read_only: true)
    typed_attribute :total_user_count, Types::Integer.meta(read_only: true)
    typed_attribute :total_project_count, Types::Integer.meta(read_only: true)
  end
end
