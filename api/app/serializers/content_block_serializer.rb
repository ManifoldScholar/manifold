# Base serializer of a content block model.
class ContentBlockSerializer < ApplicationSerializer
  type "content_blocks"
  meta(partial: false)

  attributes :id, :type, :position, :visible, :configurable, :orderable,
             :hideable, :abilities

  belongs_to :project

  def configurable
    object.configurable?
  end

  def orderable
    object.orderable?
  end

  def hideable
    object.hideable?
  end
end
