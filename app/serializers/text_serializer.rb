class TextSerializer < ActiveModel::Serializer
  attributes :id, :title, :creator_names, :unique_identifier, :cover_url, :text_sections,  :toc, :toc_section

  has_many :text_sections, serializer: TextSectionSerializer
  has_one :toc_section, serializer: TextSectionSerializer

end
