# A comment is about a subject.
class Comment < ApplicationRecord

  # Authority
  include Authority::Abilities

  # Concerns
  include TrackedCreator
  include Filterable

  # Scopes
  scope :by_subject, lambda { |subject|
    return all unless subject.present?
    where(subject_id: subject.id)
  }
  scope :by_ids, lambda { |ids|
    return all unless ids.present?
    where(id: ids)
  }

  # Associations
  belongs_to :subject, polymorphic: true
  belongs_to :parent, class_name: "Comment", optional: true

  # Validations
  validates :body, :subject, presence: true

end
