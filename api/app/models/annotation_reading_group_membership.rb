# Derive a {ReadingGroupMembership} for an {Annotation} based on its {User #creator} and {ReadingGroup}.
class AnnotationReadingGroupMembership < ApplicationRecord
  include View

  self.primary_key = :annotation_id

  belongs_to :annotation
  belongs_to :reading_group
  belongs_to :reading_group_membership, optional: true
  belongs_to :user

  scope :archived, -> { joins(:reading_group_membership).merge(ReadingGroupMembership.archived) }
  scope :active, -> { joins(:reading_group_membership).merge(ReadingGroupMembership.active) }

  scope :by_reading_group_membership, ->(reading_group_membership) { where(reading_group_membership: reading_group_membership) }
end
