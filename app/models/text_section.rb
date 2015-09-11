class TextSection < ActiveRecord::Base

  KIND_COVER_IMAGE = 'cover_image'
  KIND_NAVIGATION = 'navigation'
  KIND_SECTION = 'section'

  belongs_to :text
  belongs_to :resource

  validates_inclusion_of :kind, :in => [KIND_COVER_IMAGE, KIND_NAVIGATION, KIND_SECTION]


  def source_path
    IngestionSource.where(:resource => resource).first.source_path
  end



end
