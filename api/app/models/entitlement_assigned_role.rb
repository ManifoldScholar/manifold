class EntitlementAssignedRole < ApplicationRecord
  include View

  classy_enum_attr :role_name, enum: "RoleName", allow_blank: false

  belongs_to :user
  belongs_to :entitlement_role
  belongs_to :resource, polymorphic: true
  belongs_to :role
end
