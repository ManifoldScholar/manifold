# Provides a serialization of a page model.
class SubjectSerializer < ApplicationSerializer
  meta(partial: false)

  attributes :name
end
