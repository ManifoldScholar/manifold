class CollectionProjectSerializer < ApplicationSerializer
  meta(partial: false)

  attributes :id, :position

  has_one :project, serializer: ProjectSerializer
end
