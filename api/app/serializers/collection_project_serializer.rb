class CollectionProjectSerializer < ApplicationSerializer
  meta(partial: false)

  attributes :id, :position, :project_collection_id

  has_one :project

end
