# An annotation captures a highlighted or annotated range. This model is currently
# a likely candidate for refactoring into a "range" model that can be used by various
# other manifold records.
class Annotation < ApplicationRecord

  # Authority
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor

  # Concerns
  include TrackedCreator
  include Filterable
  include Concerns::FlaggableResource

  # Scopes
  scope :only_annotations, -> { where(format: "annotation") }
  scope :only_highlights, -> { where(format: "highlight") }
  scope :created_by, ->(user) { where(creator: user) }
  scope :by_text, lambda { |text|
    joins(:text_section).where(text_sections: { text: text }) if text.present?
  }
  scope :by_reading_group, lambda { |reading_group|
    where(reading_group: reading_group) if reading_group.present?
  }
  scope :by_reading_group_membership, lambda { |reading_group_membership|
    rgm = if reading_group_membership.instance_of?(ActiveRecord::Base)
            reading_group_membership
          else
            ReadingGroupMembership.find(reading_group_membership)
          end
    where(reading_group: rgm.reading_group_id, creator: rgm.user_id) if rgm.present?
  }
  scope :by_text_section, lambda { |text_section|
    where(text_section: text_section) if text_section.present?
  }
  scope :by_ids, lambda { |ids|
    where(id: ids) if ids.present?
  }
  scope :with_read_ability, lambda { |creator|
    next where(private: false) unless creator.present?

    where(creator: creator).or(where(private: false))
  }
  scope :by_formats, lambda { |formats|
    where(format: formats) if formats.present?
  }
  scope :with_orphaned, lambda { |orphaned|
    where.not(text_section: nil).where(orphaned: orphaned) unless orphaned.blank?
  }

  # Constants
  TYPE_ANNOTATION = "annotation".freeze
  TYPE_HIGHLIGHT = "highlight".freeze
  TYPE_RESOURCE = "resource".freeze
  TYPE_COLLECTION = "resource_collection".freeze
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

  # Associations
  # Annotations can become orphaned when the text section is deleted.
  belongs_to :text_section, optional: true
  belongs_to :reading_group, optional: true
  belongs_to :resource, optional: true
  belongs_to :resource_collection, optional: true
  has_many :comments, as: :subject, dependent: :destroy, inverse_of: :subject,
                      counter_cache: :comments_count
  has_one :text, through: :text_section
  has_one :project, through: :text
  has_one :annotation_created_event, -> { where event_type: EventType[:text_annotated] },
          class_name: "Event",
          as: :subject,
          dependent: :destroy,
          inverse_of: :subject

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
  validates :body, presence: true, if: :annotation?

  # Delegations
  delegate :text, to: :text_section, allow_nil: true
  delegate :title, to: :text, prefix: true
  delegate :project, to: :text, allow_nil: true
  delegate :text_node_for, to: :text_section, prefix: true
  delegate :text_nodes, to: :text_section, prefix: true

  # Search
  searchkick(callbacks: :async,
             batch_size: 500,
             highlight: [:title, :body])

  scope :search_import, -> { includes(:creator, text_section: { text: :project }) }

  # Callbacks
  after_commit :trigger_event_creation, on: [:create]

  def reading_group_membership
    return nil unless reading_group_id

    ReadingGroupMembership.find_by(user: creator, reading_group: reading_group)
  end

  def search_data
    {
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
    !(private || project&.draft? || format != "annotation")
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
    !private
  end

  private

  def trigger_event_creation
    return if [TYPE_HIGHLIGHT, TYPE_RESOURCE].include? format

    Event.trigger(EventType[:text_annotated], self)
  end

end
