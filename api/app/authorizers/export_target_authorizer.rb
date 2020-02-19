# Authorizer for an {ExportTarget}.
class ExportTargetAuthorizer < ApplicationAuthorizer
  expose_abilities %i[read_secrets]

  def secrets_readable_by(user, _options = {})
    admin_permissions?(user)
  end

  class << self
    def default(_adjective, user, _options = {})
      admin_permissions? user
    end

    def readable_by?(user, _options = {})
      project_creator_permissions?(user) || editor_of_any_project?(user)
    end

  end
end
