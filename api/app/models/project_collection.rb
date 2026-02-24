# frozen_string_literal: true

class ProjectCollection < ApplicationRecord
  include Authority::Abilities
  include Attachments
  include Entitleable
  include Filterable
  include HasFormattedAttributes
  include ProjectOrdering
  include SerializedAbilitiesFor
  include Sluggable
  include TrackedCreator
  include Taggable
  include WithProjectCollectionLayout
  include HasKeywordSearch

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
  has_many :unranked_collection_projects, class_name: "CollectionProject", dependent: :destroy, inverse_of: :project_collection

  has_many :projects, -> { ranked_by_collection }, through: :collection_projects
  has_many :project_subjects, -> { distinct }, through: :unranked_collection_projects, source: "subjects"
  has_many :project_collection_subjects, dependent: :destroy
  has_many :subjects, through: :project_collection_subjects

  # Scopes
  scope :by_visible, ->(visible = true) { where(visible: visible) if visible.present? }
  scope :by_show_on_homepage, ->(show = true) { where(homepage: show) if show.present? }
  scope :with_projects, lambda { |presence|
    where(id: CollectionProject.select(:project_collection_id)) if presence.present?
  }

  scope :in_default_order, -> { order(position: :asc) }

  scope :with_order, ->(by) { by.present? ? order(by) : in_default_order }

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

  has_keyword_search!(
    against: %i[title description short_description]
  )

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

  # Introspection helper
  #
  # @api private
  # @return
  def project_sorting
    Project.in_specific_order(sort_order, mode: :collection).order_values.each_with_object([]) do |ordering, tuples|
      next unless ordering.respond_to?(:expr) && ordering.respond_to?(:direction)

      tuples << [ordering.try(:expr).try(:name).to_s, ordering.try(:direction).to_s]
    end
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

    self.sort_order = DEFAULT_COLLECTION_SORT_VALUE
  end

  def cache_collection_projects!
    return unless smart?

    ProjectCollections::CacheCollectionProjects.run project_collection: self
  end
end
