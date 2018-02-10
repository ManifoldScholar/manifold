class PermissionAuthorizer < ApplicationAuthorizer

  def self.updatable_by?(user)
    user.admin? || user.editor?
  end

  def self.readable_by?(user)
    user.admin? || user.editor?
  end

  def self.creatable_by?(user)
    user.admin? || user.editor?
  end

  def self.deletable_by?(user)
    user.admin? || user.editor?
  end

  def updatable_by?(user)
    user.admin? || user.editor? || user.owner_of(resource.resource)
  end

  def readable_by?(user)
    user.admin? || user.editor? || user.owner_of(resource.resource)
  end

end
