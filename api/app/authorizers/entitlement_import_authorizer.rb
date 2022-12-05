# frozen_string_literal: true

# @see EntitlementImport
class EntitlementImportAuthorizer < ApplicationAuthorizer
  class << self
    def default(_adjective, user, _options = {})
      admin_permissions?(user)
    end
  end
end
