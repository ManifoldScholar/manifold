# Provides a full serialization of a text model.
class TextFullSerializer < TextSerializer
  include SerializedMetadata

  meta(partial: false)

  attributes :toc, :metadata, :metadata_properties, :metadata_formatted,
             :citations, :spine, :sections_map, :abilities

  belongs_to :project
  has_many :stylesheets
  has_many :creators
  has_many :contributors
  has_many :text_sections
  has_one :toc_section, serializer: TextSectionFullSerializer

end
