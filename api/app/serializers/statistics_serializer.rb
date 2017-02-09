class StatisticsSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :readers_this_week, :reader_increase, :new_highlights_count,
             :new_annotations_count, :new_texts_count
end
