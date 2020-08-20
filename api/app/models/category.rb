# Used to group texts and resources in a project
class Category < ApplicationRecord

  # Authority
  include Authority::Abilities
  include SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  # Constants
  ROLE_TEXT = "text".freeze
  ROLE_RESOURCE = "resource".freeze

  # Associations
  belongs_to :project
  has_many :texts, dependent: :nullify

  # Scopes
  scope :for_text, -> { where(role: ROLE_TEXT) }
  scope :for_resource, -> { where(role: ROLE_RESOURCE) }
  default_scope { order(position: :asc) }

  # Acts as List
  acts_as_list scope: [:project_id, :role]

  # Validation
  validates :title, presence: true
  validates :role,
            inclusion: { in: [ROLE_TEXT, ROLE_RESOURCE],
                         message: "%<value>s is not a valid category role" }

  def to_s
    title
  end

end
