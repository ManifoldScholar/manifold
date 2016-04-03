# Provides a partial serialization of a text model.
class TextPartialSerializer < ActiveModel::Serializer
  cache key: "text_partial", expires_in: 3.hours
  attributes :id, :title, :creator_names, :unique_identifier, :cover_url, :created_at,
             :first_section_id

  def first_section_id
    object.text_sections.first.try(:id)
  end

  belongs_to :project
  belongs_to :category
end
