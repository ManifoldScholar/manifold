# Base serializer of a content block model.
class ContentBlockSerializer < ApplicationSerializer
  meta(partial: false)

  attributes :id, :type, :position

  belongs_to :project
end
