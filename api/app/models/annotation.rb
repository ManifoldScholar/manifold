# frozen_string_literal: true

# An annotation captures a highlighted or annotated range. This model is currently
# a likely candidate for refactoring into a "range" model that can be used by various
# other manifold records.
class Annotation < ApplicationRecord

  # Authority
  include Authority::Abilities
  include SerializedAbilitiesFor

  # Concerns
  include TrackedCreator
  include Filterable
  include FlaggableResource
  include SearchIndexable

  # Constants
  TYPE_ANNOTATION = "annotation"
  TYPE_HIGHLIGHT = "highlight"
  TYPE_RESOURCE = "resource"
  TYPE_COLLECTION = "resource_collection"
  ANNOTATION_FORMATS = [
    TYPE_ANNOTATION,
    TYPE_HIGHLIGHT,
    TYPE_RESOURCE,
    TYPE_COLLECTION
  ].freeze
  NOTATION_TYPES = [
    TYPE_RESOURCE,
    TYPE_COLLECTION
  ].freeze

  # Annotations can become orphaned when the text section is deleted.
  belongs_to :text_section, optional: true
  belongs_to :reading_group, optional: true
  belongs_to :resource, optional: true
  belongs_to :resource_collection, optional: true
  has_many :reading_group_memberships, through: :reading_group
  has_many :comments, as: :subject, dependent: :destroy, inverse_of: :subject,
                      counter_cache: :comments_count
  has_one :text, through: :text_section
  has_one :project, through: :text
  has_one :annotation_created_event, -> { where event_type: EventType[:text_annotated] },
          class_name: "Event",
          as: :subject,
          dependent: :destroy,
          inverse_of: :subject

  has_one :annotation_node, -> { preload(ancestor_node: :children) }, inverse_of: :annotation

  has_one :annotation_reading_group_membership
  has_one :reading_group_membership, through: :annotation_reading_group_membership
  has_many :annotation_membership_comments
  has_many :membership_comments, through: :annotation_membership_comments, source: :comment

  # Validations
  validates :text_section, presence: true
  validates :resource, presence: true, if: :resource?
  validates :resource_collection, presence: true, if: :collection?
  validates :start_node, :end_node, presence: true
  validates :start_char,
            :end_char,
            presence: true,
            numericality: :only_integer, length: { minimum: 0 }
  validates :format,
            presence: true,
            inclusion: { in: ANNOTATION_FORMATS }
  validate :valid_subject?
  validates :body, presence: true, spam: { type: "annotation", if: :public? }, if: :annotation?

  # Delegations
  delegate :id, to: :project, allow_nil: true, prefix: true
  delegate :slug, to: :project, allow_nil: true, prefix: true
  delegate :title, to: :project, allow_nil: true, prefix: true

  delegate :text, to: :text_section, allow_nil: true
  delegate :text_id, to: :text_section, allow_nil: true
  delegate :title, to: :text_section, allow_nil: true, prefix: true

  delegate :slug, to: :text, allow_nil: true, prefix: true
  delegate :title, to: :text, allow_nil: true, prefix: true
  delegate :title_formatted, to: :text, allow_nil: true, prefix: true

  delegate :privacy, to: :reading_group, allow_nil: true, prefix: true
  delegate :name, to: :reading_group, allow_nil: true, prefix: true

  delegate :avatar_styles, to: :creator, allow_nil: true, prefix: true

  delegate :annotation_style, :anonymous_label, to: :reading_group_membership, allow_nil: true

  delegate :text_node_for, to: :text_section, prefix: true
  delegate :text_nodes, to: :text_section, prefix: true

  # Search
  searchkick(callbacks: :async,
             batch_size: 500,
             highlight: [:title, :body])

  # Scopes
  scope :search_import, -> { includes(:creator, text_section: { text: :project }) }
  scope :only_annotations, -> { where(format: "annotation") }
  scope :only_highlights, -> { where(format: "highlight") }
  scope :created_by, ->(user) { where(creator: user) }
  scope :sans_orphaned_from_text, -> { where.not(text_section: nil) }
  scope :by_text, lambda { |text|
    joins(:text_section).where(text_sections: { text: text }) if text.present?
  }
  scope :by_reading_group, lambda { |reading_group|
    where(reading_group: reading_group) if reading_group.present?
  }

  scope :by_reading_group_membership, ->(rgm) { build_by_reading_group_membership_scope(rgm) }

  scope :by_text_section, lambda { |text_section|
    where(text_section: text_section) if text_section.present?
  }
  scope :by_ids, lambda { |ids|
    where(id: ids) if ids.present?
  }

  scope :maybe_sans_public_annotations_not_owned_by, lambda { |sans, user|
    sans_public_annotations_not_owned_by(user) if sans
  }

  scope :sans_archived_reading_group_memberships, -> {
    no_rgm = ReadingGroupMembership.arel_table[:id].eq(nil)
    not_archived = ReadingGroupMembership.arel_table[:aasm_state].not_eq(:archived)

    left_outer_joins(:reading_group_membership).where(no_rgm.or(not_archived))
  }

  scope :with_read_ability_when_reading_groups_disabled, lambda { |user, exclude_public = false|
    if user.present?
      sans_private_annotations_not_owned_by(user)
        .maybe_sans_public_annotations_not_owned_by(exclude_public, user)
        .where(reading_group: nil)
    else
      return none if exclude_public

      non_private.where(reading_group: nil)
    end
  }

  scope :with_read_ability, lambda { |user, exclude_public = false|
    return with_read_ability_when_reading_groups_disabled(user, exclude_public) if Settings.instance.general[:disable_reading_groups]

    # Exclude annotations that are private and not created by the user.
    # Exclude annotations that have a non-public reading group that the user does not belong to.
    if user.present?
      left_outer_joins(:reading_group)
        .sans_archived_reading_group_memberships
        .sans_private_annotations_not_owned_by(user)
        .maybe_sans_public_annotations_not_owned_by(exclude_public, user)
        .where(arel_reading_groups_for_user(user, with_membership_only: exclude_public))
    else
      return only_resource_annotations if exclude_public

      left_outer_joins(:reading_group)
        .sans_archived_reading_group_memberships
        .non_private
        .where(reading_groups: { id: [nil, ReadingGroup.visible_to_public] })
    end
  }
  scope :by_formats, lambda { |formats|
    where(format: formats) if formats.present?
  }
  scope :with_orphaned, lambda { |orphaned|
    where.not(text_section: nil).where(orphaned: orphaned) unless orphaned.blank?
  }
  scope :with_existing_text, lambda {
    where.not(text_section: nil)
  }

  scope :only_resource_annotations, -> { where(format: TYPE_RESOURCE) }
  scope :sans_public_annotations_not_owned_by, ->(user) { where(arel_exclude_public_annotations_not_owned_by(user)) }
  scope :sans_private_annotations_not_owned_by, ->(user) { where(arel_exclude_private_annotations_not_owned_by(user)) }
  scope :non_private, -> { where(private: false) }

  scope :with_order, ->(by = nil) do
    case by
    when "created_at ASC"
      order(created_at: :asc)
    when "created_at DESC"
      order(created_at: :desc)
    else
      order(created: :desc)
    end
  end

  # Callbacks
  after_commit :enqueue_annotation_notifications, on: [:create]
  after_commit :maybe_enqueue_annotation_notifications, on: [:update]
  after_commit :trigger_event_creation, on: [:create]

  delegate :node, to: :annotation_node, prefix: :derived, allow_nil: true

  class << self
    # @param [User, nil] user
    # @return [Arel::Nodes::Not]
    def arel_exclude_private_annotations_not_owned_by(user)
      Arel::Nodes::Not.new(arel_table[:creator_id].not_eq(user&.id).and(arel_table[:private].eq(true)))
    end

    # @param [User, nil] user
    # @return [Arel::Nodes::Not]
    def arel_exclude_public_annotations_not_owned_by(user)
      Arel::Nodes::Not.new(arel_table[:creator_id].not_eq(user&.id)
                               .and(Arel::Nodes::Not.new(arel_table[:format].eq(TYPE_RESOURCE)))
                               .and(arel_table[:reading_group_id].eq(nil))
                               .and(arel_table[:private].eq(false)))
    end

    def arel_reading_groups_for_user(user, with_membership_only: false)
      id_scope = ReadingGroupVisibility.visible_or_joined_reading_group_ids_for(user, joined: with_membership_only)

      ReadingGroup.arel_id_is_null_or_within_scope(id_scope).or(arel_table[:creator_id].eq(user.id))
    end
  end

  # @param [ReadingGroupMembership, String] rgm
  # @return [<Comment>]
  def filtered_membership_comments_for(rgm)
    return [] if rgm.blank?

    user_id = rgm.is_a?(ReadingGroupMembership) ? rgm.user_id : ReadingGroupMembership.where(id: rgm).first&.user_id

    return [] if user_id.blank?

    membership_comments.then do |comments|
      if comments.loaded?
        comments.select { |comm| comm.creator_id == user_id }
      else
        comments.by_creator(user_id).to_a
      end
    end
  end

  def reading_group_membership
    return nil unless reading_group_id

    ReadingGroupMembership.find_by(user: creator, reading_group: reading_group)
  end

  def search_data
    {
      search_result_type: search_result_type,
      title: subject,
      full_text: body,
      creator: creator&.full_name,
      parent_project: project&.id,
      parent_text_section: text_section&.id,
      parent_text: text&.id,
      parent_keywords: [
        text&.title
      ],
      hidden: false
    }
  end

  def should_index?
    !(private? || project&.draft? || format != "annotation")
  end

  def to_s
    "annotation #{id}"
  end

  def resource?
    format == TYPE_RESOURCE
  end

  def annotation?
    format == TYPE_ANNOTATION
  end

  def highlight?
    format == TYPE_HIGHLIGHT
  end

  def collection?
    format == TYPE_COLLECTION
  end

  def valid_subject?
    return errors.add(:subject, "can't be nil value") if subject.nil?
    return errors.add(:subject, "can't be blank") if subject.empty?

    true
  end

  def author_created
    creator.project_author_of? project
  end

  def start_text_node
    text_section_text_node_for start_node
  end

  def end_text_node
    text_section_text_node_for end_node
  end

  def public?
    !private?
  end

  private

  def enqueue_annotation_notifications
    return unless public? && annotation?
    return if reading_group.present? && reading_group.private?

    Notifications::EnqueueAnnotationNotificationsJob.perform_later id
  end

  def maybe_enqueue_annotation_notifications
    return unless saved_change_to_body? || saved_change_to_private?

    enqueue_annotation_notifications
  end

  def trigger_event_creation
    return if [TYPE_HIGHLIGHT, TYPE_RESOURCE].include? format
    return unless public?

    Event.trigger(EventType[:text_annotated], self)
  end

  class << self
    def filtered(params, scope: all, user: nil)
      scope = scope.includes(:annotation_node)

      super(params, scope: scope, user: user)
    end

    # @param [ReadingGroupMembership, String] rgm
    # @return [ActiveRecord::Relation<ReadingGroup>]
    def build_by_reading_group_membership_scope(rgm)
      return all if rgm.blank?

      made_by_member = arel_quote_query AnnotationReadingGroupMembership.by_reading_group_membership(rgm).active.select(:annotation_id)

      commented_on_by_member = arel_quote_query AnnotationMembershipComment.by_reading_group_membership(rgm).active.select(:annotation_id)

      id = arel_table[:id]

      condition = arel_grouping arel_expr_in_query(id, made_by_member).or(arel_expr_in_query(id, commented_on_by_member))

      includes(:membership_comments).where(condition)
    end
  end
end
