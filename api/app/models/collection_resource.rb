# Tracks the relationship between collections and resources
class CollectionResource < ApplicationRecord

  # Authority
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  # Associations
  belongs_to :collection, counter_cache: true
  belongs_to :resource

  # Concerns
  acts_as_list scope: :collection_id

  # Validations
  validate :collection_and_resource_must_belong_to_same_project

  def collection_and_resource_must_belong_to_same_project
    return unless collection.project != resource.project
    errors.add(:resource, "can't belong to a different project")
  end

  def to_s
    "#{collection} #{resource}"
  end

end
