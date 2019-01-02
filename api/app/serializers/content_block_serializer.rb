# Base serializer of a content block model.
class ContentBlockSerializer < ApplicationSerializer
  type "content_blocks"
  meta(partial: false)

  attributes :id, :type, :position, :visible, :configurable

  belongs_to :project

  def configurable
    object.configurable?
  end
end
