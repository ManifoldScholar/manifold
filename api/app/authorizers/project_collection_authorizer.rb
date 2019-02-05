class ProjectCollectionAuthorizer < ApplicationAuthorizer

  def self.default(_able, user, _options = {})
    marketeer_permissions?(user)
  end

  def self.readable(_able, _user, _options = {})
    true
  end

  def default(_able, user, _options = {})
    creator_or_has_marketeer_permissions?(user, resource)
  end

  def readable_by?(user, _options = {})
    return true if resource.visible?

    creator_or_has_marketeer_permissions?(user, resource)
  end

end
