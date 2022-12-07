# frozen_string_literal: true

# @see PendingEntitlement
class PendingEntitlementAuthorizer < ApplicationAuthorizer
  class << self
    def default(_adjective, user, _options = {})
      admin_permissions?(user)
    end
  end
end
