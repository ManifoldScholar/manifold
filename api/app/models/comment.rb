# A comment is about a subject.
class Comment < ApplicationRecord

  # Closure Tree
  has_closure_tree order: "sort_order", dependent: :destroy

  # Authority
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor

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
  belongs_to :subject, polymorphic: true, counter_cache: :comments_count
  belongs_to :parent, class_name: "Comment", optional: true, inverse_of: :children,
                      counter_cache: :children_count
  has_many :children, class_name: "Comment", foreign_key: :parent_id, dependent: :destroy,
                      inverse_of: :parent, counter_cache: :children_count
  has_many :flags, as: :flaggable, dependent: :destroy, inverse_of: :flaggable

  # Validations
  validates :body, :subject, presence: true

end
