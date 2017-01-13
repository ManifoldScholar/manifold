# A section in a text
class TextSection < ApplicationRecord

  # Constants
  KIND_COVER_IMAGE = "cover_image".freeze
  KIND_NAVIGATION = "navigation".freeze
  KIND_SECTION = "section".freeze
  ALLOWED_KINDS = [KIND_COVER_IMAGE, KIND_NAVIGATION, KIND_SECTION].freeze

  # Authority
  include Authority::Abilities

  # Associations
  belongs_to :text
  belongs_to :ingestion_source
  has_many :annotations

  # Delegation
  delegate :source_path, to: :ingestion_source
  delegate :project, to: :text

  # Validation
  validates :position, numericality: { only_integer: true }
  validates :kind, inclusion: { in: ALLOWED_KINDS }

  def previous_section
    text.section_before(position)
  end

  def next_section
    text.section_after(position)
  end

  def to_s
    name
  end

end
