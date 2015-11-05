# A section in a text
class TextSection < ActiveRecord::Base
  KIND_COVER_IMAGE = "cover_image"
  KIND_NAVIGATION = "navigation"
  KIND_SECTION = "section"
  ALLOWED_KINDS = [KIND_COVER_IMAGE, KIND_NAVIGATION, KIND_SECTION]

  belongs_to :text
  belongs_to :resource

  validates :kind, inclusion: { in: ALLOWED_KINDS }

  def source_path
    IngestionSource.find_by(resource: resource).source_path
  end
end
