# Serializes a Text model
class TextSerializer < TextPartialSerializer
  meta(partial: false)

  attributes :toc
  belongs_to :project
  has_many :stylesheets
  has_many :creators
  has_many :contributors
  has_many :text_sections, serializer: TextSectionPartialSerializer
  has_one :toc_section, serializer: TextSectionSerializer
end
