# Tracks the relationship between collections and resources
class CollectionResource < ActiveRecord::Base

  # Associations
  belongs_to :collection
  belongs_to :resource

  validate :collection_and_resource_must_belong_to_same_project

  def collection_and_resource_must_belong_to_same_project
    if collection.project != resource.project
      errors.add(:resource, "can't belong to a different project")
    end
  end

end
