class EntitlementGrant < ApplicationRecord
  include MaterializedView

  classy_enum_attr :current_state, enum: "EntitlementState", allow_blank: false, default: :pending
  classy_enum_attr :role_name, enum: "RoleName", allow_blank: false
  classy_enum_attr :role_kind, enum: "RoleKind", allow_blank: false

  attribute :summaries, Entitlements::Summary.to_array_type

  belongs_to :user
  belongs_to :entitlement_role
  belongs_to :resource, polymorphic: true
end
