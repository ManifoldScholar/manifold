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
  include Entitleable
  include SerializedAbilitiesFor
  include StoresFingerprints
  include Taggable
  include TrackedCreator
  include Collaborative
  include Citable
  include MoneyAttributes
  include TruthyChecks
  include Filterable
  include Attachments
  include Metadata
  include HasFormattedAttributes
  include HasSortTitle
  include WithPermittedUsers
  include Sluggable
  include SearchIndexable

  # Magic
  has_formatted_attributes :description, :subtitle, :image_credits
  has_formatted_attributes :restricted_access_body, include_wrap: false
  has_formatted_attributes :title, include_wrap: false
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

  # PaperTrail
  has_paper_trail

  jsonb_accessor(
    :export_configuration,
    exports_as_bag_it: [:boolean, { default: false, store_key: :bag_it }]
  )

  # Associations
  has_many :collection_projects, dependent: :destroy, inverse_of: :project
  has_many :collection_project_rankings, through: :collection_projects, source: :ranking
  has_many :project_collections, through: :collection_projects, dependent: :destroy
  has_many :texts, dependent: :destroy, inverse_of: :project
  has_many :text_summaries, inverse_of: :project
  has_many :published_texts,
           -> { published(true) },
           class_name: "Text",
           inverse_of: :project
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
  has_many :resources, -> { with_order }, dependent: :destroy, inverse_of: :project
  has_many :resource_collections, dependent: :destroy, inverse_of: :project
  has_many :collection_resources, through: :resource_collections, inverse_of: :project
  has_many :project_subjects, dependent: :destroy, inverse_of: :project
  has_many :subjects, through: :project_subjects
  has_many :ingestions, dependent: :destroy, inverse_of: :project
  has_many :twitter_queries, dependent: :destroy, inverse_of: :project
  has_many :permissions, as: :resource, inverse_of: :resource

  has_many :resource_imports, inverse_of: :project, dependent: :destroy
  has_many :tracked_dependent_versions,
           -> { order(created_at: :desc) },
           as: :parent_item,
           class_name: "Version",
           dependent: :nullify,
           inverse_of: :parent_item
  has_many :content_blocks,
           -> { order(:position) },
           dependent: :destroy,
           inverse_of: :project
  has_many :content_block_references, through: :content_blocks

  has_many :action_callouts,
           -> { order(:position) },
           dependent: :destroy,
           inverse_of: :project

  has_many :project_exports, inverse_of: :project, dependent: :destroy
  has_many :project_export_statuses, inverse_of: :project
  has_many :project_exportations, dependent: :destroy
  has_one :current_project_export_status, -> { current }, class_name: "ProjectExportStatus"
  has_one :current_project_export, through: :current_project_export_status, source: :project_export
  has_many :uncollected_resources, ->(object) {
    where.not(id: object.collection_resources.select(:resource_id))
  }, class_name: "Resource"
  # rubocop:enable

  # Callbacks
  before_update :prepare_to_reindex_children, if: :draft_changed?
  before_create :assign_publisher_defaults!
  after_commit :trigger_creation_event, on: [:create]
  after_commit :queue_reindex_children_job

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

  enum standalone_mode: {
    disabled: 0,
    enabled: 1,
    enforced: 2
  }, _prefix: true

  # Attachments
  manifold_has_attached_file :cover, :image
  manifold_has_attached_file :hero, :image
  manifold_has_attached_file :avatar, :image

  scope :by_featured, lambda { |featured|
    next all if featured.nil?

    where(featured: to_boolean(featured)).order(Arel.sql("RANDOM()")).limit(4)
  }

  scope :by_subject, lambda { |subject|
    next all unless subject.present?

    where(id: unscoped.joins(:project_subjects)
                      .merge(ProjectSubject.by_subject(subject)).select(:project_id))
  }

  scope :restricted, -> do
    return where(open_access: false) if Settings.instance.general["restricted_access"]

    where(restricted_access: true)
  end
  scope :unrestricted, -> do
    return where(open_access: true) if Settings.instance.general["restricted_access"]

    where(restricted_access: false)
  end
  scope :drafts, -> { where(draft: true) }
  scope :published, -> { where(draft: false) }
  scope :by_draft, ->(draft = nil) { where(draft: to_boolean(draft)) unless draft.nil? }

  scope :standalone_enforced, -> { where(standalone_mode: standalone_modes[:enforced]) }
  scope :standalone_unforced, -> { where.not(standalone_mode: standalone_modes[:enforced]) }

  scope :ranked_by_collection, (lambda do
    is_same_project = CollectionProjectRanking
        .arel_table[:project_id]
        .eq(arel_table[:id])

    in_same_collection = CollectionProject
        .arel_table[:id]
        .eq(CollectionProjectRanking.arel_table[:collection_project_id])

    joins(:collection_project_rankings).merge(CollectionProjectRanking.ranked)
      .where(is_same_project.and(in_same_collection))
  end)

  scope :with_order, ->(by = nil) { by.present? ? order(by) : order(:sort_title, :title) }

  scope :by_standalone_mode_enforced, ->(enforced) { to_boolean(enforced) ? standalone_enforced : standalone_unforced }

  scope :with_creator_role, ->(user = nil) { where(creator: user) if user.present? }

  scope :with_read_ability, ->(user = nil) { build_read_ability_scope_for user }
  scope :with_full_read_ability, ->(user = nil) { build_full_read_ability_scope_for user }

  scope :with_update_ability, ->(user = nil) { build_update_ability_scope_for user }

  scope :exports_as_bag_it, -> { export_configuration_where(exports_as_bag_it: true) }
  scope :sans_current_bag_it_export, -> { where.not(id: ProjectExportStatus.current_project_ids) }
  scope :with_current_bag_it_export, -> { where(id: ProjectExportStatus.current_project_ids) }
  scope :pending_bag_it_export, -> { exports_as_bag_it.sans_current_bag_it_export }

  scope :in_collection, ->(collection) { joins(:collection_projects).merge(CollectionProject.by_collection(collection)) }
  scope :with_collection_order, ->(collection_id = nil) do
    next unless collection_id.present?

    collection = ProjectCollection.friendly.find(collection_id)

    ranked_by_collection.in_collection(collection)
  end

  # Search
  scope :search_import, -> {
    includes(
      :collaborators,
      :subjects,
      :makers,
      texts: :titles
    )
  }

  searchkick(word_start: TYPEAHEAD_ATTRIBUTES,
             callbacks: :async,
             batch_size: 500,
             highlight: [:title, :body])

  # rubocop:disable Metrics/AbcSize
  def search_data
    {
      search_result_type: search_result_type,
      title: title,
      full_text: description_plaintext,
      keywords: (tag_list + texts.map(&:title) + subjects.map(&:title) + hashtag).reject(&:blank?),
      creator: creator&.full_name,
      makers: makers.map(&:full_name),
      metadata: metadata.values.reject(&:blank?)
    }.merge(search_hidden)
  end
  # rubocop:enable Metrics/AbcSize

  def search_hidden
    {
      hidden: draft?
    }
  end

  def social_image
    hero? ? hero_styles[:medium] : nil
  end

  # I believe this is here to allow us to pass `Project` as a scope in our resourceful
  # controllers. See the load_resources_for in the resourceful_methods controller concern.
  # -ZD
  def self.call
    all
  end

  def self.filter_if_not_featured(params, scope: all, user: nil)
    return scope.by_featured(true) if params["featured"]

    Project.filtered(params, scope: scope, user: user)
  end

  def events_for_project_detail
    filtered_events.limit(6)
  end

  def resources_for_project_detail
    resources.limit(10)
  end

  def events_for_project_detail_ids
    events_for_project_detail.pluck(:id)
  end

  def resources_for_project_detail_ids
    resources_for_project_detail.pluck(:id)
  end

  def filtered_events
    events.excluding_type(%w(comment_created text_annotated))
  end

  def filtered_event_count
    filtered_events.count
  end

  def uniq_event_types
    filtered_events.pluck(:event_type).uniq
  end

  def unsorted_resources
    resources.reorder(nil)
  end

  def resource_kinds
    unsorted_resources
      .distinct("resources.kind")
      .pluck(:kind)
  end

  def resource_tags
    unsorted_resources.joins(:tags).distinct.pluck("tags.name")
  end

  def sorted_resource_tags
    resource_tags.sort
  end

  def following_twitter_accounts?
    twitter_queries.length.positive?
  end

  def to_s
    title
  end

  def updated?
    return false unless updated_at

    updated_at.strftime("%F") != created_at.strftime("%F")
  end

  def recently_updated?
    updated? && updated_at >= Time.current - 1.week
  end

  def reindex_children
    resources.reindex(:search_hidden, mode: :async)
    texts.reindex(:search_hidden, mode: :async)
    TextSection.in_texts(texts).reindex(:search_hidden, mode: :async)
  end

  def standalone?
    !standalone_mode_disabled?
  end

  def texts_in_toc_blocks_ids
    content_block_references
      .where("content_block_references.referencable_type" => "Text")
      .pluck("content_block_references.referencable_id")
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

    ProjectJobs::ReindexChildren.perform_later(self)
    @reindex_children = false
  end

  def trigger_creation_event
    Event.trigger(EventType[:project_created], self)
  end

  class << self
    # @see .arel_build_read_case_statement_for
    # @param [User, nil] user
    # @return [ActiveRecord::Relation<Project>]
    def build_read_ability_scope_for(user = nil)
      return published unless user.present?

      where(arel_build_read_case_statement_for(user, full: false))
    end

    # @see .arel_build_read_case_statement_for
    # @param [User, nil] user
    # @return [ActiveRecord::Relation<Project>]
    def build_full_read_ability_scope_for(user = nil)
      return published.unrestricted unless user.present?

      where(arel_build_read_case_statement_for(user, full: true))
    end

    # @param [User, nil] user
    # @return [ActiveRecord::Relation<Project>]
    def build_update_ability_scope_for(user = nil)
      return none if user.blank?

      where arel_with_roles_for(user, RoleName.for_project_update)
    end

    private

    # rubocop:disable Metrics/AbcSize
    # This creates a case statement to be supplied to `where`.
    #
    # * If the project is a draft, only show for users with draft access roles
    # * If the project has restricted access, only show for users that have been granted
    #   access to it
    #
    # @param [User, nil] user
    def arel_build_read_case_statement_for(user, full: false)
      arel_case.tap do |stmt|
        stmt.when(arel_table[:draft]).then(arel_with_draft_roles_for(user))
        if full
          if Settings.instance.general["restricted_access"]
            stmt.when(arel_table[:open_access].eq(false), false).then(arel_with_full_read_access_roles_for(user))
          else
            stmt.when(arel_table[:restricted_access]).then(arel_with_full_read_access_roles_for(user))
          end
        end
        stmt.else(true)
      end
    end
    # rubocop:enable Metrics/AbcSize

    # @see .arel_with_roles_for
    # @param [User] user
    # @return [Arel::Nodes::Or]
    def arel_with_draft_roles_for(user)
      arel_with_roles_for(user, RoleName.for_draft_access)
    end

    # @see .arel_with_roles_for
    # @param [User] user
    # @return [Arel::Nodes::Or]
    def arel_with_full_read_access_roles_for(user)
      arel_with_roles_for(user, RoleName.for_full_read_access)
    end

    # @see RoleName.for_access
    # @param [User] user
    # @param [<Symbol, String>] global role names
    # @param [<Symbol, String>] scoped role names
    # @return [Arel::Nodes::Or]
    def arel_with_roles_for(user, global: [], scoped: [])
      query = unscoped.with_role(scoped, user).unscope(:select).select(primary_key)

      has_global_role = global.any? { |role| user.has_cached_role? role, :any }

      arel_attr_in_query(primary_key, query).or(arel_quote(has_global_role))
    end
  end
end
