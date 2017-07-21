# An annotation captures a highlighted or annotated range. This model is currently
# a likely candidate for refactoring into a "range" model that can be used by various
# other manifold records.
class Annotation < ApplicationRecord

  # Authority
  include Authority::Abilities

  # Concerns
  include TrackedCreator
  include Filterable

  # Scopes
  scope :only_annotations, -> { where(format: "annotation") }
  scope :only_highlights, -> { where(format: "highlight") }
  scope :created_by, ->(user) { where(creator: user) }
  # Scopes
  scope :excluding_private, lambda { |creator|
    return all unless creator.present?
    where("(private = true AND creator_id = ?) OR (private = false)", creator.id)
  }
  scope :by_text_section, lambda { |text_section|
    return all unless text_section.present?
    where(text_section: text_section)
  }
  scope :by_ids, lambda { |ids|
    return all unless ids.present?
    where(id: ids)
  }
  scope :by_project, lambda { |project|
    return all unless project.present?
    joins(text_section: :text).where("texts.project_id = ?", project)
  }
  scope :by_text, lambda { |text|
    return all unless text.present?
    joins(:text_section).where("text_sections.text_id = ?", text)
  }

  # Constants
  TYPE_ANNOTATION = "annotation".freeze
  TYPE_HIGHLIGHT = "highlight".freeze
  TYPE_RESOURCE = "resource".freeze

  # Associations
  belongs_to :text_section
  belongs_to :resource, optional: true
  has_many :comments, as: :subject

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
  validates :body, presence: true, if: :annotation?

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
