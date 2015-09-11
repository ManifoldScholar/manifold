class IngestionSource < ActiveRecord::Base

  KIND_COVER_IMAGE = 'cover_image'
  KIND_NAVIGATION = 'navigation'
  KIND_SECTION = 'section'
  KIND_PUBLICATION_RESOURCE = 'publication_resource'

  belongs_to :text
  belongs_to :resource

  validates :source_identifier, presence: true
  validates_inclusion_of :kind, :in => [KIND_COVER_IMAGE, KIND_NAVIGATION, KIND_SECTION, KIND_PUBLICATION_RESOURCE]

end
