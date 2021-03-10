# rubocop:disable Layout/LineLength
module Collections
  Mapping = MultiKeyable::Map.from(
    [
      Collections::Definition.new("ReadingGroup", grouping: "ReadingGroupCategory", collects: %w[Project Resource ResourceCollection Text TextSection], reorderable: true),
      Collections::Definition.new("User", entry_prefix: "UserCollected", collects: %w[Project Resource ResourceCollection Text TextSection], reorderable: false)
    ]
  )
end
# rubocop:enable Layout/LineLength
