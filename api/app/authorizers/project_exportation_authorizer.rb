# Authorizer for a {ProjectExportation}.
class ProjectExportationAuthorizer < ApplicationAuthorizer
  class << self
    def default(_adjective, user, _options = {})
      admin_permissions? user
    end
  end
end
