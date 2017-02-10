class ProjectAuthorizer < ApplicationAuthorizer

  def self.updatable_by?(user)
    user.admin?
  end

  def self.creatable_by?(user)
    user.admin?
  end

  def self.readable_by?(_user)
    true
  end

end
