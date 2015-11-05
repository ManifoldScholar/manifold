# Connects texts to resources that were sources for text sections during ingestion
class IngestionSource < ActiveRecord::Base
  KIND_COVER_IMAGE = "cover_image"
  KIND_NAVIGATION = "navigation"
  KIND_SECTION = "section"
  KIND_PUBLICATION_RESOURCE = "publication_resource"
  ALLOWED_KINDS = [
    KIND_COVER_IMAGE,
    KIND_NAVIGATION,
    KIND_SECTION,
    KIND_PUBLICATION_RESOURCE
  ]

  belongs_to :text
  belongs_to :resource

  validates :source_identifier, presence: true
  validates :kind, inclusion: { in: ALLOWED_KINDS }
end
