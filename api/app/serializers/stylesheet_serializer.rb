# Provides a partial serialization of a project model.
class StylesheetSerializer < ActiveModel::Serializer
  attributes :id, :name, :source_identifier, :styles
end
