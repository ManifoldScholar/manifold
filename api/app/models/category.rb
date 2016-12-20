# Used to group texts and resources in a project
class Category < ActiveRecord::Base

  # Authority
  include Authority::Abilities

  # Constants
  ROLE_TEXT = "text".freeze
  ROLE_RESOURCE = "resource".freeze

  # Associations
  belongs_to :project
  has_many :texts

  # Scopes
  scope :for_text, -> { where(role: ROLE_TEXT) }
  scope :for_resource, -> { where(role: ROLE_RESOURCE) }

  # Validation
  validates :role,
            inclusion: { in: [ROLE_TEXT, ROLE_RESOURCE],
                         message: "%{value} is not a valid category role" }

  def to_s
    title
  end

end
