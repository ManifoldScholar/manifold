# Tracks the relationship between collections and resources
class CollectionResource < ApplicationRecord

  # Authority
  include Authority::Abilities
  include SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  # Associations
  belongs_to :resource_collection, counter_cache: true
  belongs_to :resource
  has_one :project, through: :resource_collection

  # Concerns
  acts_as_list scope: :resource_collection_id

  # Validations
  validate :collection_and_resource_must_belong_to_same_project

  def collection_and_resource_must_belong_to_same_project
    return unless resource_collection.project != resource.project

    errors.add(:resource, "can't belong to a different project")
  end

  def to_s
    "#{resource_collection} #{resource}"
  end

end
