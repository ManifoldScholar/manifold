class TextSectionSerializer < ActiveModel::Serializer
  attributes :id, :name, :body, :source_identifier, :kind

end
