# frozen_string_literal: true

class UserGroupAuthorizer < ApplicationAuthorizer

  # Admins only
  def self.default(_ability, user, _options = {})
    admin_permissions?(user)
  end
end
