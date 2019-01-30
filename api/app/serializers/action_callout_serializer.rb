# Base serializer of a call to action model.
class ActionCalloutSerializer < ApplicationSerializer
  attributes :id, :title, :kind, :location, :position, :url, :button, :attachment_styles

  belongs_to :project
  belongs_to :text
end
