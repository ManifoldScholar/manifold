# Provides a partial serialization of a text model.
class TextPartialSerializer < ActiveModel::Serializer
  attributes :id, :title, :creator_names, :unique_identifier, :cover_url, :created_at,
             :first_section_id

  def first_section_id
    object.text_sections.first.id
  end

  belongs_to :category
end
