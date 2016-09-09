# A section in a text
class TextSection < ActiveRecord::Base
  KIND_COVER_IMAGE = "cover_image".freeze
  KIND_NAVIGATION = "navigation".freeze
  KIND_SECTION = "section".freeze
  ALLOWED_KINDS = [KIND_COVER_IMAGE, KIND_NAVIGATION, KIND_SECTION].freeze

  belongs_to :text
  belongs_to :resource
  has_many :annotations

  validates :position, numericality: { only_integer: true }
  validates :kind, inclusion: { in: ALLOWED_KINDS }

  def previous_section
    text.section_before(position)
  end

  def next_section
    text.section_after(position)
  end

  def source_path
    IngestionSource.find_by(resource: resource).source_path
  end
end
