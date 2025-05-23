# frozen_string_literal: true

# Derive a {ReadingGroupMembership} for an {Annotation} based on its {User #creator} and {ReadingGroup}.
class AnnotationReadingGroupMembership < ApplicationRecord
  include View

  self.primary_key = :annotation_id

  belongs_to :annotation, inverse_of: :annotation_reading_group_membership
  belongs_to :reading_group
  belongs_to :reading_group_membership, optional: true
  belongs_to :user

  scope :archived, -> { joins(:reading_group_membership).merge(ReadingGroupMembership.archived) }
  scope :active, -> { joins(:reading_group_membership).merge(ReadingGroupMembership.active) }

  scope :by_reading_group_membership, ->(reading_group_membership) { where(reading_group_membership: reading_group_membership) }
end
