class ReadingGroupCollection < ApplicationRecord
  include ComposedCollection

  self.primary_key = :reading_group_id

  belongs_to :reading_group, inverse_of: :reading_group_collection
end
