class Role < ApplicationRecord
  ROLE_ADMIN = "admin".freeze
  ROLE_READER = "reader".freeze
  ROLE_AUTHOR = "author".freeze
  ALLOWED_ROLES = [
    ROLE_ADMIN,
    ROLE_AUTHOR,
    ROLE_READER
  ].freeze

  scopify

  belongs_to :resource,
             polymorphic: true,
             optional: true
  has_many :users_roles, class_name: "UsersRoles"
  has_many :users, through: :users_roles, source: :user

  validates :resource_type,
            inclusion: { in: Rolify.resource_types },
            allow_nil: true
  validates :name, inclusion: { in: ALLOWED_ROLES }

end
