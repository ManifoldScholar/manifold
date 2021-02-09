# {ReadingGroupEntry} models create and maintain 1:1 representations here
# in order to allow simpler generation of {ReadingGroupCollection} records.
class ReadingGroupCompositeEntry < ApplicationRecord
  upsert_keys %i[reading_group_id collectable_type collectable_id]

  belongs_to :reading_group
  belongs_to :reading_group_category, optional: true
  belongs_to :collectable, polymorphic: true

  belongs_to :reading_group_project, optional: true
  belongs_to :reading_group_resource, optional: true
  belongs_to :reading_group_resource_collection, optional: true
  belongs_to :reading_group_text, optional: true

  validates :collectable_jsonapi_type, presence: true
end
