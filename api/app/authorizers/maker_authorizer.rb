class MakerAuthorizer < ApplicationAuthorizer

  def self.default(_able, user, _options = {})
    marketeer_permissions?(user) || project_creator_permissions?(user)
  end

  def default(_able, user, _options = {})
    editor_permissions?(user) ||
      resource_belongs_to_updatable_project?(user, resource)
  end

end
