# rubocop:disable Layout/LineLength
module Collections
  Mapping = MultiKeyable::Map.from(
    [
      Collections::Definition.new("ReadingGroup", grouping: "ReadingGroupCategory", collects: %w[Project Resource ResourceCollection Text], reorderable: true),
      Collections::Definition.new("User", entry_prefix: "UserCollected", collects: %w[Project Resource ResourceCollection Text], reorderable: false)
    ]
  )
end
# rubocop:enable Layout/LineLength
