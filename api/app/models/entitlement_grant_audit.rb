class EntitlementGrantAudit < ApplicationRecord
  include MaterializedView

  # @todo We need to add composite primary keys
  self.primary_key = :user_id

  classy_enum_attr :role_name, allow_blank: false
  classy_enum_attr :action, enum: "EntitlementAuditAction", allow_blank: false

  belongs_to :user
  belongs_to :entitlement_role
  belongs_to :resource, polymorphic: true

  scope :by_action, ->(*action) { where(action: action) }
  scope :with_includes, -> { includes(:user, :resource) }
  scope :actionable, -> { with_includes.by_action(:add_role, :remove_role) }

  delegate :change_role?, *EntitlementAuditAction.predicates, to: :action, prefix: :should

  # @return [(User, RoleName, ApplicationRecord)]
  # @return [(User, RoleName, nil)]
  def to_role_tuple
    return [] unless should_change_role?

    [user, role_name, resource]
  end
end
