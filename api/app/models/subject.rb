# A subject
class Subject < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:title].freeze

  # Authority
  include Authority::Abilities
  include SerializedAbilitiesFor
  include Filterable
  include SearchIndexable

  # Associations
  has_many :text_subjects, dependent: :destroy
  has_many :project_subjects, dependent: :destroy
  has_many :project_collection_subjects, dependent: :destroy
  has_many :texts, through: :text_subjects
  has_many :projects, through: :project_subjects
  has_many :project_collections, through: :project_collection_subjects

  scope :by_featured, lambda { |featured|
    return all unless featured.present?

    joins(:projects).where("projects.featured = true")
  }

  scope :with_order, lambda {
    order(name: :asc)
  }

  scope :by_used, lambda { |used|
    return all unless used.present?

    joins(:project_subjects).where("project_subjects.id IS NOT NULL").group(:id)
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
      search_result_type: search_result_type,
      title: title,
      hidden: false
    }
  end

  def to_s
    title
  end
end
