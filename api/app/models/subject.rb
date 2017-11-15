# A subject
class Subject < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:name].freeze

  # Authority
  include Authority::Abilities
  include Filterable

  # Search
  searchkick word_start: TYPEAHEAD_ATTRIBUTES, callbacks: :async

  # Associations
  has_many :text_subjects
  has_many :project_subjects
  has_many :texts, through: :text_subjects
  has_many :projects, through: :project_subjects

  scope :by_featured, lambda { |featured|
    return all unless featured.present?
    joins(:projects).where("projects.featured = true")
  }

  # Validations
  validates :name, presence: true, uniqueness: true

  def to_s
    title
  end
end
