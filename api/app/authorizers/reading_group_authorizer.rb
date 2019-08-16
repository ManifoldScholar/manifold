class ReadingGroupAuthorizer < ApplicationAuthorizer

  # There are cases where all users can CRUD annotations.
  def self.default(_able, _user, _options = {})
    true
  end

  def self.readable_by?(_user, _options = {})
    true
  end

  def creatable_by?(user, _options = {})
    known_user?(user)
  end

  def deletable_by?(user, _options = {})
    creator_or_has_admin_permissions?(user, resource)
  end

  def updatable_by?(user, _options = {})
    creator_or_has_admin_permissions?(user, resource)
  end

  def readable_by?(user, _options = {})
    return false unless known_user?(user)

    creator_or_has_admin_permissions?(user, resource) || resource.users.include?(user)
  end

  def self.listable_by?(user, _options = {})
    admin_permissions?(user)
  end

end
