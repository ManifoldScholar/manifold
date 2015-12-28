# Serializes a Text model
class TextSerializer < ActiveModel::Serializer
  attributes :id, :title, :creator_names, :unique_identifier, :cover_url,
             :toc, :toc_section, :created_at

  belongs_to :category
  has_one :project
  has_many :text_sections, serializer: TextSectionPartialSerializer
  has_one :toc_section, serializer: TextSectionSerializer
end


