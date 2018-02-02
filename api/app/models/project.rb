# The project model is the primary unit of Manifold.
class Project < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:title, :makers].freeze
  AVATAR_COLOR_PRIMARY = "primary".freeze
  AVATAR_COLOR_SECONDARY = "secondary".freeze
  AVATAR_COLOR_TERTIARY = "tertiary".freeze
  AVATAR_COLOR_QUATERNARY = "quaternary".freeze
  AVATAR_COLOR_QUINARY = "quinary".freeze
  AVATAR_COLOR_SENTARY = "sentary".freeze
  AVATAR_COLORS = [
    AVATAR_COLOR_PRIMARY,
    AVATAR_COLOR_SECONDARY,
    AVATAR_COLOR_TERTIARY,
    AVATAR_COLOR_QUATERNARY,
    AVATAR_COLOR_QUINARY,
    AVATAR_COLOR_SENTARY
  ].freeze

  # Concerns
  include Authority::Abilities
  include TrackedCreator
  include Collaborative
  include Citable
  include MoneyAttributes
  include WithMarkdown
  include TruthyChecks
  include Filterable
  include Attachments
  include Metadata
  include Concerns::HasFormattedAttributes
  extend FriendlyId

  # Magic
  with_metadata %w(
    series_title container_title isbn issn doi original_publisher
    original_publisher_place original_title publisher publisher_place version
    series_number edition issue volume rights rights_territory restrictions rights_holder
  )
  with_citation do |project|
    {
      title: project.title,
      author: project.creator_names_array,
      issued: project.publication_date
    }
  end
  with_citable_children :texts
  has_formatted_attribute :description

  # URLs
  friendly_id :title, use: :slugged

  # Search
  searchkick word_start: TYPEAHEAD_ATTRIBUTES, callbacks: :async

  # Rolify
  resourcify

  # Associations
  belongs_to :published_text, class_name: "Text", optional: true
  has_many :texts, dependent: :destroy
  has_many :text_categories, -> { for_text }, class_name: "Category", dependent: :destroy
  has_many :resource_categories,
           -> { for_resource },
           class_name: "Category",
           dependent: :destroy
  has_many :favorites, as: :favoritable, dependent: :destroy
  has_many :events, -> { order "events.created_at DESC" }, dependent: :destroy
  has_many :resources, dependent: :destroy
  has_many :collections, dependent: :destroy
  has_many :collection_resources, through: :collections
  has_many :project_subjects
  has_many :subjects, through: :project_subjects
  has_many :ingestions
  has_many :twitter_queries

  # rubocop:disable Style/Lambda
  has_many :uncollected_resources, ->(object) {
    where.not(id: object.collection_resources.select(:resource_id))
  }, class_name: "Resource"
  # rubocop:end Style/Lambda

  # Callbacks
  after_commit :trigger_creation_event, on: [:create]
  before_save :update_sort_title, if: :title_changed?

  # Delegations
  delegate :count, to: :collections, prefix: true
  delegate :count, to: :resources, prefix: true

  # Misc
  money_attributes :purchase_price

  # Validation
  validates :purchase_url, url: { allow_nil: true }
  validates :title, presence: true
  validates :purchase_price_currency,
            inclusion: { in: Money::Currency.all.map(&:iso_code) },
            allow_nil: true
  validates :avatar_color,
            presence: true,
            inclusion: { in: AVATAR_COLORS },
            unless: :avatar?
  validates :draft, inclusion: { in: [true, false] }

  # Attachments
  manifold_has_attached_file :cover, :image
  manifold_has_attached_file :hero, :image
  manifold_has_attached_file :avatar, :image

  # Scopes
  scope :search_import, -> { includes(:collaborators, :makers) }

  scope :by_featured, lambda { |featured|
    return all if featured.nil?
    where(featured: to_boolean(featured))
  }

  scope :by_subject, lambda { |subject|
    return all unless subject.present?
    joins(:project_subjects).where(project_subjects: { subject: subject })
  }
  scope :with_order, lambda { |by = nil|
    return order(:sort_title, :title) unless by.present?
    order(by)
  }

  scope :excluding_drafts, -> { where(draft: false) }

  # Why is this here? --ZD
  def self.call
    all
  end

  def update_sort_title
    return if title.blank?
    self.sort_title = title[/^((a|the|an) )?(?<title>.*)$/i, :title]
  end

  def search_data
    {
      title: title,
      body: description,
      makers: makers.map(&:name),
      project_slug: slug
    }
  end

  def resource_kinds
    resources
      .select("resources.kind")
      .distinct
      .to_a.pluck(:kind)
  end

  def resource_tags
    resources
      .tag_counts
      .pluck(:name)
  end

  def following_twitter_accounts?
    twitter_queries.length.positive?
  end

  def to_s
    title
  end

  def updated?
    updated_at.strftime("%F") != created_at.strftime("%F")
  end

  def recently_updated?
    updated? && updated_at >= Time.current - 1.week
  end

  private

  def trigger_creation_event
    Event.trigger(Event::PROJECT_CREATED, self)
  end
end
