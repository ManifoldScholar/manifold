class PermissionAuthorizer < ApplicationAuthorizer

  def self.default(_able, user, options = {})
    return true if editor_permissions?(user)
    return false unless options[:for]
    return false unless options[:for].respond_to? :permissions_updatable_by?
    options[:for].permissions_updatable_by? user
  end

  def default(_able, user, _options = {})
    return true if editor_permissions?(user)
    return false unless resource.resource
    return false unless resource.resource.respond_to? :permissions_updatable_by?
    resource.resource.permissions_updatable_by? user
  end

end
