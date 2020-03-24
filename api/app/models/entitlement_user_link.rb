class EntitlementUserLink < ApplicationRecord
  upsert_keys %i[entitlement_id user_id]

  belongs_to :entitlement, inverse_of: :entitlement_user_links
  belongs_to :user, inverse_of: :entitlement_user_links

  validates :entitlement_id, uniqueness: { on: :update, scope: :user_id }

  scope :by_target, ->(target) { joins(:entitlement).merge(Entitlement.by_target(target)) }
  scope :by_entitlement, ->(entitlement) { where(entitlement: entitlement) }
  scope :by_user, ->(user) { where(user: user) }

  after_create :grant_roles!

  delegate :granted_role_names, :subject, to: :entitlement

  # @api private
  # @return [void]
  def grant_roles!
    granted_role_names.each do |role_name|
      user.add_role role_name, subject
    end
  end
end
