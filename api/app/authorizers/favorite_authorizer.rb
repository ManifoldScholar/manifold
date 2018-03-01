class FavoriteAuthorizer < ApplicationAuthorizer

  def self.default(_able, _user, _options = {})
    true
  end

  def default(_able, user, _options = {})
    creator_or_has_admin_permissions?(user, resource)
  end

end
