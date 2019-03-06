class PermissionAuthorizer < ApplicationAuthorizer

  def self.default(_able, user, options = {})
    return true if editor_permissions?(user)
    return false unless options[:for]
    return false unless options[:for].respond_to? :permissions_manageable_by?

    options[:for].permissions_manageable_by? user
  end

  def default(_able, user, _options = {})
    return true if creator_or_has_editor_permissions?(user, resource)
    return false unless resource.resource
    return false unless resource.resource.respond_to? :permissions_manageable_by?

    resource.resource.permissions_manageable_by? user
  end

end
