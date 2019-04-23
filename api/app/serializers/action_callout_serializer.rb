# Base serializer of a call to action model.
class ActionCalloutSerializer < ApplicationSerializer
  attributes :id, :title, :kind, :location, :position, :url, :button, :attachment_styles, :external_link

  belongs_to :project
  belongs_to :text

  def external_link
    object.external_link?
  end
end
