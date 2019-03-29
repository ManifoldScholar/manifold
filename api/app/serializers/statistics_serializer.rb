class StatisticsSerializer < ApplicationSerializer
  meta(partial: false)

  attributes :readers_this_week, :reader_increase, :new_highlights_count,
             :new_annotations_count, :new_texts_count, :total_text_count,
             :total_resource_count, :total_annotation_count, :total_comment_count,
             :total_user_count, :total_project_count
end
