# An annotation captures a highlighted or annotated range. This model is currently
# a likely candidate for refactoring into a "range" model that can be used by various
# other manifold records.
class Annotation < ApplicationRecord

  # Authority
  include Authority::Abilities

  # Concerns
  include TrackedCreator

  # Scopes
  scope :only_annotations, -> { where(format: "annotation") }
  scope :only_highlights, -> { where(format: "highlight") }
  scope :created_by, ->(user) { where(creator: user) }

  # Constants
  TYPE_ANNOTATION = "annotation".freeze
  TYPE_HIGHLIGHT = "highlight".freeze
  TYPE_RESOURCE = "resource".freeze

  # Associations
  belongs_to :text_section
  belongs_to :resource, optional: true

  # Validations
  validates :text_section, presence: true
  validates :resource, presence: true, if: :resource?
  validates :start_node, :end_node, presence: true
  validates :start_char,
            :end_char,
            presence: true,
            numericality: :only_integer, length: { minimum: 0 }
  validates :format,
            presence: true,
            inclusion: { in: %W(#{TYPE_ANNOTATION} #{TYPE_HIGHLIGHT} #{TYPE_RESOURCE}) }
  validate :valid_subject?

  # Delegations
  delegate :text, to: :text_section
  delegate :project, to: :text

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

  def valid_subject?
    return errors.add(:subject, "can't be nil value") if subject.nil?
    return errors.add(:subject, "can't be blank") if subject.empty?
    true
  end

end
