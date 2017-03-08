# Provides a serialization of a page model.
class SubjectSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :name
end
