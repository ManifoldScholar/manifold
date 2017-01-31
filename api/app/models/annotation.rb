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

end
