class Role < ApplicationRecord
  include SerializedAbilitiesFor

  scopify

  classy_enum_attr :name, enum: "RoleName", allow_blank: false
  classy_enum_attr :kind, enum: "RoleKind", allow_blank: false, default: :unknown

  scope :by_name, ->(name) { where(name: name) }
  scope :by_kind, ->(kind) { where(kind: kind) }
  scope :scoped, -> { by_kind(:scoped) }

  belongs_to :resource, polymorphic: true, optional: true
  has_and_belongs_to_many :users, join_table: "users_roles"

  validates :resource_type, inclusion: { in: Rolify.resource_types }, allow_nil: true
  validate :check_resource_for_kind!

  before_validation :set_kind!

  delegate :has_expected_resource?, *RoleKind.predicates, to: :kind

  private

  # @return [void]
  def check_resource_for_kind!
    errors.add :resource, "must be a single record" if has_expected_resource? && !resource.is_a?(ApplicationRecord)

    errors.add :resource, "must be a system entitlement" if global_entitlement? && !resource.is_a?(SystemEntitlement)
  end

  # @return [void]
  def set_kind!
    self.kind = name.is_a?(RoleName) ? name.kind : RoleKind[:unknown]
  end
end
