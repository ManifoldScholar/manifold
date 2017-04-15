# Serializes a Text Section model
class TextSectionPartialSerializer < ActiveModel::Serializer
  meta(partial: true)

  attributes :id, :name, :body_json, :source_identifier, :kind

  belongs_to :text
end
