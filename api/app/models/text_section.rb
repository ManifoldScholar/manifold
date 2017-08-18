# A section in a text
class TextSection < ApplicationRecord
  attribute :body_json, :indifferent_hash

  # Constants
  KIND_COVER_IMAGE = "cover_image".freeze
  KIND_NAVIGATION = "navigation".freeze
  KIND_SECTION = "section".freeze
  ALLOWED_KINDS = [KIND_COVER_IMAGE, KIND_NAVIGATION, KIND_SECTION].freeze

  # Authority
  include Authority::Abilities
  include Citable

  with_citation do |text_section|
    (text_section.text_citation_parts || {}).merge(
      title: text_section.name,
      container_title: text_section.text_title
    )
  end

  # Associations
  belongs_to :text
  belongs_to :ingestion_source
  has_many :annotations
  has_many :resources, through: :annotations
  has_many :collections, through: :annotations

  # Delegation
  delegate :citation_parts, to: :text, prefix: true, allow_nil: true
  delegate :source_path, to: :ingestion_source
  delegate :project, to: :text
  delegate :metadata, to: :text, allow_nil: true
  delegate :title, to: :text, prefix: true, allow_nil: true
  delegate :creator_names_array, to: :text, prefix: true, allow_nil: true

  # Validation
  validates :position, numericality: { only_integer: true }
  validates :kind, inclusion: { in: ALLOWED_KINDS }

  def previous_section
    text.section_before(position)
  end

  def next_section
    text.section_after(position)
  end

  def toc?
    kind == KIND_NAVIGATION
  end

  def cover?
    kind == KIND_COVER_IMAGE
  end

  def to_s
    name
  end

end
