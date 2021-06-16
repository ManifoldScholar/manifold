# Serves as a composite, polymorphic collection of all a user's collected records.
#
# Not used directly, but used in several cases where the entire collection needs to be rendered.
#
# Can refer to:
# - {UserCollectedProject}
# - {UserCollectedResource}
# - {UserCollectedResourceCollection}
# - {UserCollectedText}
class UserCollectedCompositeEntry < ApplicationRecord
  upsert_keys %i[user_id collectable_type collectable_id]

  belongs_to :user
  belongs_to :collectable, polymorphic: true
  belongs_to :project, optional: true

  belongs_to :user_collected_project, optional: true
  belongs_to :user_collected_resource, optional: true
  belongs_to :user_collected_resource_collection, optional: true
  belongs_to :user_collected_text, optional: true

  has_many :subjects, through: :project

  has_one :favorite, foreign_key: :id, inverse_of: :user_collected_composite_entry

  validates :collectable_jsonapi_type, presence: true
end
