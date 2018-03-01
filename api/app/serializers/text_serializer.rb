# Serializes a Text model
class TextSerializer < TextPartialSerializer
  include SerializedMetadata

  meta(partial: false)

  attributes :toc, :metadata, :metadata_properties, :metadata_formatted,
             :citations, :description, :spine, :sections_map, :abilities

  belongs_to :project
  has_many :stylesheets, serializer: StylesheetPartialSerializer
  has_many :creators
  has_many :contributors
  has_many :text_sections, serializer: TextSectionPartialSerializer
  has_one :toc_section, serializer: TextSectionSerializer

end
