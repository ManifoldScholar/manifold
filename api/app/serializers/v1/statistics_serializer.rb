module V1
  class StatisticsSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :readers_this_week, NilClass
    typed_attribute :reader_increase, NilClass
    typed_attribute :new_highlights_count, NilClass
    typed_attribute :new_annotations_count, NilClass
    typed_attribute :new_texts_count, NilClass
    typed_attribute :total_text_count, NilClass
    typed_attribute :total_resource_count, NilClass
    typed_attribute :total_annotation_count, NilClass
    typed_attribute :total_comment_count, NilClass
    typed_attribute :total_user_count, NilClass
    typed_attribute :total_project_count, NilClass
  end
end
