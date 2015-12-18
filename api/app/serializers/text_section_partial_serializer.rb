# Serializes a Text Section model
class TextSectionPartialSerializer < ActiveModel::Serializer
  attributes :id, :name, :source_identifier, :kind

  belongs_to :text
end
