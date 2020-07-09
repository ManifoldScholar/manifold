class EntitlementRole < ApplicationRecord
  upsert_keys %i[name]

  classy_enum_attr :name, enum: "RoleName", allow_blank: false
  classy_enum_attr :kind, enum: "RoleKind", allow_blank: false
  has_many :derived_roles, class_name: "EntitlementDerivedRole", inverse_of: :entitlement_role

  before_validation :infer_kind!

  validates :name, uniqueness: { on: :update }
  validate :must_be_entitlement!

  private

  # @return [void]
  def infer_kind!
    self.kind = name.kind
  end

  # @return [void]
  def must_be_entitlement!
    errors.add :name, "must be entitlement" unless name.entitlement?
    errors.add :kind, "must be entitlement" unless kind.entitlement?
  end
end
