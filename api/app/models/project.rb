# The project model is the primary unit of Manifold.
class Project < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:title, :maker_names].freeze
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
  include Concerns::SerializedAbilitiesFor
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
  include Concerns::HasSortTitle
  include Concerns::ValidatesSlugPresence
  include WithPermittedUsers
  extend FriendlyId

  # Magic
  has_formatted_attribute :description
  with_metadata %w(
    series_title container_title isbn issn doi original_publisher
    original_publisher_place original_title publisher publisher_place version
    series_number edition issue volume rights rights_territory restrictions rights_holder
    resources_doi
  )
  with_citation do |project|
    {
      title: project.title,
      author: project.creator_names_array,
      issued: project.publication_date
    }
  end
  with_citable_children :texts
  has_sort_title do |project|
    project.title[/^((a|the|an) )?(?<title>.*)$/i, :title]
  end

  # URLs
  friendly_id :title, use: :slugged

  # Rolify
  resourcify

  # PaperTrail
  has_paper_trail on: [:update]

  # Associations
  # rubocop:disable Rails/InverseOf
  belongs_to :published_text, class_name: "Text", optional: true
  # rubocop:enable Rails/InverseOf
  has_many :texts, dependent: :destroy, inverse_of: :project
  has_many :text_categories, -> { for_text }, class_name: "Category", dependent: :destroy,
                                              inverse_of: :project
  has_many :resource_categories,
           -> { for_resource },
           class_name: "Category",
           dependent: :destroy,
           inverse_of: :project
  has_many :favorites, as: :favoritable, dependent: :destroy, inverse_of: :favoritable
  has_many :events, -> { order "events.created_at DESC" }, dependent: :destroy,
                                                           inverse_of: :project
  has_many :resources, dependent: :destroy, inverse_of: :project
  has_many :collections, dependent: :destroy, inverse_of: :project
  has_many :collection_resources, through: :collections, inverse_of: :project
  has_many :project_subjects, dependent: :destroy, inverse_of: :project
  has_many :subjects, through: :project_subjects
  has_many :ingestions, dependent: :destroy, inverse_of: :project
  has_many :twitter_queries, dependent: :destroy, inverse_of: :project
  # rubocop:disable Rails/HasManyOrHasOneDependent
  has_many :permissions, as: :resource, inverse_of: :resource
  # rubocop:enable Rails/HasManyOrHasOneDependent
  has_many :resource_imports, inverse_of: :project, dependent: :destroy
  has_many :tracked_dependent_versions,
           -> { order(created_at: :desc) },
           as: :parent_item,
           class_name: "Version",
           dependent: :nullify,
           inverse_of: :parent_item

  # rubocop:disable Style/Lambda, Rails/InverseOf
  has_many :uncollected_resources, ->(object) {
    where.not(id: object.collection_resources.select(:resource_id))
  }, class_name: "Resource"
  # rubocop:enable Style/Lambda, Rails/InverseOf

  # Callbacks
  before_save :prepare_to_reindex_children, on: [:update], if: :draft_changed?
  before_create :assign_publisher_defaults!
  after_commit :trigger_creation_event, on: [:create]
  after_commit :queue_reindex_children_job

  # Delegations
  delegate :count, to: :collections, prefix: true
  delegate :count, to: :resources, prefix: true

  # Misc
  money_attributes :purchase_price

  # Validation
  validates :purchase_url, url: { allow_blank: true }
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
  manifold_has_attached_file :published_text_attachment,
                             :resource,
                             validate_content_type: false

  # Scopes
  scope :by_featured, lambda { |featured|
    next all if featured.nil?
    where(featured: to_boolean(featured)).order("RANDOM()").limit(4)
  }

  scope :by_subject, lambda { |subject|
    next all unless subject.present?
    joins(:project_subjects).where(project_subjects: { subject: subject })
  }

  scope :by_draft, lambda { |draft|
    where(draft: to_boolean(draft)) unless draft.nil?
  }

  scope :with_order, lambda { |by = nil|
    next order(:sort_title, :title) unless by.present?
    order(by)
  }

  scope :with_read_ability, lambda { |user = nil|
    next all if user && Project.drafts_readable_by?(user)
    next where(draft: false) unless user
    updatable_projects = Project.authorizer.scope_updatable_projects(user).pluck(:id)
    where(draft: false).or(where(id: updatable_projects))
  }

  scope :with_update_ability, lambda { |user = nil|
    next none unless user && Project.updatable_by?(user)
    Project.authorizer.scope_updatable_projects(user)
  }

  # Search
  # rubocop:disable Style/Lambda
  scope :search_import, -> {
    includes(
      :collaborators,
      :subjects,
      :makers,
      texts: :titles
    )
  }
  # rubocop:enable Style/Lambda

  searchkick(word_start: TYPEAHEAD_ATTRIBUTES,
             callbacks: :async,
             batch_size: 500,
             highlight: [:title, :body])

  def search_data
    {
      title: title,
      body: description_plaintext,
      featured: featured,
      maker_names: makers.map(&:full_name),
      text_titles: texts.map(&:title),
      subject_titles: subjects.map(&:title),
      hashtag: hashtag,
      publication_date: publication_date,
      metadata: metadata
    }.merge(search_hidden)
  end

  def search_hidden
    {
      hidden: draft?
    }
  end

  # I believe this is here to allow us to pass `Project` as a scope in our resourceful
  # controllers. See the load_resources_for in the resourceful_methods controller concern.
  # -ZD
  def self.call
    all
  end

  def self.filter_if_not_featured(params, scope: all, user: nil)
    return scope.by_featured(true) if params["featured"]
    Project.filter(params, scope: scope, user: user)
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

  def reindex_children
    resources.reindex(:search_hidden, mode: :async)
    texts.reindex(:search_hidden, mode: :async)
    TextSection.in_texts(texts).reindex(:search_hidden, mode: :async)
    SearchableNode.in_texts(texts).reindex(:search_hidden, mode: :async)
  end

  def published_text_download_url
    return published_text_attachment.url if published_text_attachment.present?
    return download_url if download_url.present?
    nil
  end

  private

  def assign_publisher_defaults!
    assign_default_meta :publisher
    assign_default_meta :publisher_place
  end

  def assign_default_meta(attr)
    return if metadata[attr].present?
    settings = Settings.instance
    default = settings.general.dig("default_#{attr}")

    return unless default.present?
    metadata[attr] = default
  end

  def prepare_to_reindex_children
    @reindex_children = true
  end

  def queue_reindex_children_job
    return unless @reindex_children
    ProjectJobs::ReindexChildren.perform_later(id)
    @reindex_children = false
  end

  def trigger_creation_event
    Event.trigger(EventType[:project_created], self)
  end
end
