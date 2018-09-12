class ProjectCollectionAuthorizer < ApplicationAuthorizer

  def self.default(_able, user, _options = {})
    editor_permissions?(user)
  end

  def self.readable(_able, _user, _options = {})
    true
  end

  def default(_able, user, _options = {})
    creator_or_has_editor_permissions?(user, resource)
  end

  def readable(_able, user, _options = {})
    return true unless resource.draft?
    creator_or_has_editor_permissions?(user, resource)
  end

end
