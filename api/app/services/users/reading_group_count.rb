module Users
  class ReadingGroupCount < Types::FlexibleStruct
    ZERO = Types::Integer.default(0)

    SCHEMA = Types::Hash.schema(
      annotations_count: ZERO,
      orphaned_annotations_count: ZERO,
      highlights_count: ZERO,
      orphaned_highlights_count: ZERO,
      comments_count: ZERO,
      orphaned_comments_count: ZERO,
      all_annotations_count: ZERO
    )

    attribute? :annotations_count, ZERO
    attribute? :orphaned_annotations_count, ZERO
    attribute? :highlights_count, ZERO
    attribute? :orphaned_highlights_count, ZERO
    attribute? :comments_count, ZERO
    attribute? :orphaned_comments_count, ZERO

    # @return [Integer]
    def all_annotations_count
      annotations_count + highlights_count
    end

    def as_json(*)
      super.merge(slice(:all_annotations_count))
    end
  end
end
