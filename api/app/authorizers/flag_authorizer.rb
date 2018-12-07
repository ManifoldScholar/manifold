class FlagAuthorizer < ApplicationAuthorizer

  def self.default(_able, _user, _options = {})
    false
  end

  def self.creatable_by?(_user, _options = {})
    true
  end

  def self.deletable_by?(_user, _options = {})
    true
  end

  def creatable_by?(user, _options = {})
    known_user?(user)
  end

  def deletable_by?(user, _options = {})
    creator_or_has_editor_permissions?(user, resource)
  end

end
