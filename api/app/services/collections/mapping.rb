# rubocop:disable Layout/LineLength
module Collections
  Mapping = MultiKeyable::Map.from(
    [
      Collections::Definition.new("ReadingGroup", grouping: "ReadingGroupCategory", collects: %w[Project Resource ResourceCollection Text], reorderable: true)
    ]
  )
end
# rubocop:enable Layout/LineLength
