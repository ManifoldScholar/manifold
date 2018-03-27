# A subject
class Subject < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:title].freeze

  # Authority
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  include Filterable

  # Associations
  has_many :text_subjects, dependent: :destroy
  has_many :project_subjects, dependent: :destroy
  has_many :texts, through: :text_subjects
  has_many :projects, through: :project_subjects

  scope :by_featured, lambda { |featured|
    return all unless featured.present?
    joins(:projects).where("projects.featured = true")
  }

  scope :by_used, lambda { |used|
    return all unless used.present?
    joins(:project_subjects).where("project_subjects.id IS NOT NULL")
  }

  # Validations
  validates :name, presence: true, uniqueness: true

  alias_attribute :title, :name

  # Search
  searchkick(word_start: TYPEAHEAD_ATTRIBUTES,
             callbacks: :async,
             batch_size: 500)

  def search_data
    {
      title: title,
      hidden: false
    }
  end

  def to_s
    title
  end
end
