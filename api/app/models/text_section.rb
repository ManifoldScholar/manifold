# A section in a text
class TextSection < ActiveRecord::Base
  KIND_COVER_IMAGE = "cover_image"
  KIND_NAVIGATION = "navigation"
  KIND_SECTION = "section"
  ALLOWED_KINDS = [KIND_COVER_IMAGE, KIND_NAVIGATION, KIND_SECTION]

  belongs_to :text
  belongs_to :resource

  validates :position, numericality: { only_integer: true }
  validates :kind, inclusion: { in: ALLOWED_KINDS }

  def previous_section
    text.section_before(self.position)
  end

  def next_section
    text.section_after(self.position)
  end

  def source_path
    IngestionSource.find_by(resource: resource).source_path
  end
end
