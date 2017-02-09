# Provides a partial serialization of a project model.
class StylesheetSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :id, :name, :source_identifier, :styles
end
