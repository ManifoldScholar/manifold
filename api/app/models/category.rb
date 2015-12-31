# Used to group texts and resources in a project
class Category < ActiveRecord::Base
  ROLE_TEXT = "text"
  ROLE_RESOURCE = "resource"

  belongs_to :project
  has_many :texts

  validates :role,
            inclusion: { in: [ROLE_TEXT, ROLE_RESOURCE],
                         message: "%{value} is not a valid category role" }

  scope :for_text, -> { where(role: ROLE_TEXT) }
  scope :for_resource, -> { where(role: ROLE_RESOURCE) }
end
