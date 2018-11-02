class ProjectCollection < ApplicationRecord

  # Concerns
  include Concerns::HasFormattedAttributes
  include Concerns::ValidatesSlugPresence
  include Filterable
  include TrackedCreator

  # Authority
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  include Concerns::Taggable

  # Slugs
  extend FriendlyId
  friendly_id :title, use: :slugged

  # Ordering
  acts_as_list

  # Formatted Attributes
  has_formatted_attribute :description, include_wrap: false

  # Relationships
  has_many :collection_projects, dependent: :destroy, inverse_of: :project_collection do
    def with_collection_order
      return with_manual_order if proxy_association.owner.manually_sorted?
      with_dynamic_order
    end

    def with_manual_order
      order(position: :asc)
    end

    def with_dynamic_order
      joins(:project).order(proxy_association.owner.project_sorting)
    end
  end
  has_many :projects, through: :collection_projects, dependent: :destroy
  has_many :project_collection_subjects, dependent: :destroy
  has_many :subjects, through: :project_collection_subjects

  # Scopes
  scope :by_visible, ->(visible) { where(visible: visible) if visible.present? }
  scope :by_show_on_homepage, ->(show) { where(homepage: show) if show.present? }
  scope :with_projects, lambda { |presence|
    where(id: CollectionProject.select(:project_collection_id)) if presence.present?
  }
  scope :with_order, lambda { |by|
    return order(position: :asc) unless by.present?
    order(by)
  }

  # Callbacks
  before_save :reset_sort_order!
  after_save :cache_collection_projects!

  # Validation
  validates :title, presence: true, uniqueness: true
  validates :sort_order, :icon, presence: true
  validates :number_of_projects, numericality: { only_integer: true,
                                                 greater_than_or_equal_to: 0 },
                                allow_nil: true

  def project_sorting
    column, _delimiter, direction = sort_order.rpartition "_"
    "projects.#{column} #{direction}"
  end

  def manually_sorted?
    sort_order == "manual"
  end

  private

  def reset_sort_order!
    return unless smart? && manually_sorted?
    self.sort_order = "created_at_asc"
  end

  def cache_collection_projects!
    return unless smart?
    ProjectCollections::CacheCollectionProjects.run project_collection: self
  end
end
