# frozen_string_literal: true

class UserGroupEntitleableAuthorizer < ApplicationAuthorizer
  # Admins only
  def self.default(_ability, user, _options = {})
    admin_permissions?(user)
  end
end
