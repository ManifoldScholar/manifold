# Provides a partial serialization of a project model.
class StylesheetSerializer < ActiveModel::Serializer
  cache key: "stylesheet", expires_in: 3.hours
  attributes :id, :name, :source_identifier, :styles
end
