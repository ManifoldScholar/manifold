class ProjectCollection < ApplicationRecord

  # Constants
  ALLOWED_SORT_KEYS = %w(created_at updated_at publication_date title).freeze
  ALLOWED_SORT_DIRECTIONS = %w(asc desc).freeze

  # Concerns
  include Entitleable
  include HasFormattedAttributes
  include Filterable
  include Attachments
  include TrackedCreator
  include Authority::Abilities
  include SerializedAbilitiesFor
  include Taggable
  include Sluggable
  include WithProjectCollectionLayout

  # Attachments
  manifold_has_attached_file :hero, :image
  manifold_has_attached_file :custom_icon, :image
  manifold_has_attached_file :social_image, :image

  # Ordering
  acts_as_list

  # Formatted Attributes
  has_formatted_attribute :description, include_wrap: false
  has_formatted_attribute :short_description, include_wrap: false

  resourcify

  # Relationships
  has_many :collection_projects, -> { ranked }, dependent: :destroy, inverse_of: :project_collection

  has_many :projects, -> { ranked_by_collection }, through: :collection_projects
  has_many :project_collection_subjects, dependent: :destroy
  has_many :subjects, through: :project_collection_subjects

  # Scopes
  scope :by_visible, ->(visible = true) { where(visible: visible) if visible.present? }
  scope :by_show_on_homepage, ->(show = true) { where(homepage: show) if show.present? }
  scope :with_projects, lambda { |presence|
    where(id: CollectionProject.select(:project_collection_id)) if presence.present?
  }
  scope :with_order, lambda { |by|
    return order(position: :asc) unless by.present?

    order(by)
  }
  scope :after_homepage_start_date, lambda { |date|
    no_date = arel_table[:homepage_end_date].eq(nil)
    after_date = arel_table[:homepage_start_date].lteq(date)
    where(after_date.or(no_date)) if date.present?
  }
  scope :before_homepage_end_date, lambda { |date|
    no_date = arel_table[:homepage_end_date].eq(nil)
    before_date = arel_table[:homepage_end_date].gt(date)
    where(before_date.or(no_date)) if date.present?
  }
  scope :by_homepage_date_range, lambda { |date|
    after_homepage_start_date(date).before_homepage_end_date(date)
  }
  scope :by_visible_on_homepage, lambda { |_args = nil|
    by_visible.by_show_on_homepage.by_homepage_date_range(Time.zone.today)
  }

  # Callbacks
  before_save :reset_sort_order!
  after_save :cache_collection_projects!

  # Validation
  validates :title, presence: true, uniqueness: true
  validates :sort_order, presence: true
  validates :number_of_projects, numericality: { only_integer: true,
                                                 greater_than_or_equal_to: 0 },
                                allow_nil: true
  validates :homepage_count, numericality: { only_integer: true,
                                             greater_than_or_equal_to: 0,
                                             less_than_or_equal_to: 40 },
                              allow_nil: true
  validate :valid_homepage_start_date!, :valid_homepage_end_date!

  def project_sorting
    column, _delimiter, direction = sort_order.rpartition "_"
    column = "created_at" unless ALLOWED_SORT_KEYS.include? column
    direction = "desc" unless ALLOWED_SORT_DIRECTIONS.include? direction

    "projects.#{column} #{direction}, projects.title asc NULLS LAST"
  end

  def manually_sorted?
    sort_order == "manual"
  end

  def projects=(projects)
    self.collection_projects = projects.map do |project, index|
      CollectionProject.new(project: project, project_collection: self, position: index)
    end
  end

  private

  def valid_homepage_start_date!
    return true unless homepage_end_date.present?
    return true if homepage_start_date.nil?
    return true if homepage_start_date <= homepage_end_date

    errors.add(:homepage_start_date, "must be before or on homepage end date")
  end

  def valid_homepage_end_date!
    return true unless homepage_start_date.present?
    return true if homepage_end_date.nil?
    return true if homepage_end_date >= homepage_start_date

    errors.add(:homepage_end_date, "must be after or on homepage start date")
  end

  def reset_sort_order!
    return unless smart? && manually_sorted?

    self.sort_order = "created_at_desc"
  end

  def cache_collection_projects!
    return unless smart?

    ProjectCollections::CacheCollectionProjects.run project_collection: self
  end
end
