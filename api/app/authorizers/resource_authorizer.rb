class ResourceAuthorizer < ApplicationAuthorizer

  def self.updatable_by?(user)
    user.admin?
  end

  def self.readable_by?(_user)
    true
  end

  def self.creatable_by?(user)
    user.admin?
  end

  def self.deletable_by?(user)
    user.admin?
  end

end
