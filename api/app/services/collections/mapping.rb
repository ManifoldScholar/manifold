# frozen_string_literal: true

module Collections
  Mapping = MultiKeyable::Map.from(
    [
      Collections::Definition.new("ReadingGroup", grouping: "ReadingGroupCategory", collects: %w[Project Resource ResourceCollection Text TextSection JournalIssue], reorderable: true),
      Collections::Definition.new("User", entry_prefix: "UserCollected", collects: %w[Project Resource ResourceCollection Text TextSection JournalIssue], reorderable: false)
    ]
  )
end
