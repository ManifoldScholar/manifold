# Serializes a Text Section model
class TextSectionSerializer < ActiveModel::Serializer
  attributes :id, :name, :body, :source_identifier, :kind
end
