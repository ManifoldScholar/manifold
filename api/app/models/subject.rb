# frozen_string_literal: true

# A subject
class Subject < ApplicationRecord
  TYPEAHEAD_ATTRIBUTES = [:title].freeze

  include Authority::Abilities
  include SerializedAbilitiesFor
  include Filterable
  include SearchIndexable
  include HasKeywordSearch

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

    joins(:project_subjects).where.not(project_subjects: { id: nil }).group(:id)
  }

  validates :name, presence: true, uniqueness: true

  alias_attribute :title, :name

  has_keyword_search! against: %i[name]

  def to_s
    title
  end
end
