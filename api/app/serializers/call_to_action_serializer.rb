# Base serializer of a call to action model.
class CallToActionSerializer < ApplicationSerializer
  attributes :id, :title, :kind, :location, :position, :url

  belongs_to :project
  belongs_to :text
end
