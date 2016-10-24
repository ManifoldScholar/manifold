# A section in a text
class TextSection < ActiveRecord::Base
  KIND_COVER_IMAGE = "cover_image".freeze
  KIND_NAVIGATION = "navigation".freeze
  KIND_SECTION = "section".freeze
  ALLOWED_KINDS = [KIND_COVER_IMAGE, KIND_NAVIGATION, KIND_SECTION].freeze

  belongs_to :text
  belongs_to :ingestion_source
  has_many :annotations
  delegate :source_path, to: :ingestion_source

  validates :position, numericality: { only_integer: true }
  validates :kind, inclusion: { in: ALLOWED_KINDS }

  def previous_section
    text.section_before(position)
  end

  def next_section
    text.section_after(position)
  end

end
