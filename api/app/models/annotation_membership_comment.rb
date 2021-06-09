class AnnotationMembershipComment < ApplicationRecord
  belongs_to :annotation
  belongs_to :comment
  belongs_to :reading_group
  belongs_to :reading_group_membership
  belongs_to :user

  scope :by_reading_group_membership, ->(rgm) { where(reading_group_membership: rgm) }
  scope :active, -> { joins(:reading_group_membership).merge(ReadingGroupMembership.active) }
end
