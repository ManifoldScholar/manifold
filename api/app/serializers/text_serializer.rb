# Serializes a Text model
class TextSerializer < TextPartialSerializer
  meta(partial: false)

  attributes :toc, :metadata, :metadata_properties, :citations

  belongs_to :project
  has_many :stylesheets
  has_many :creators
  has_many :contributors
  has_many :text_sections, serializer: TextSectionPartialSerializer
  has_one :toc_section, serializer: TextSectionSerializer

  def metadata_properties
    object.metadata_properties.map { |p| p.camelize(:lower) }
  end

end
