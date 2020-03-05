class EntitlementDerivedRole < ApplicationRecord
  include Concerns::View

  belongs_to :entitlement, inverse_of: :derived_roles
  belongs_to :entitlement_role, inverse_of: :derived_roles
end
