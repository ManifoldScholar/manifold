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

  def self.deletable_by?(user)
    user.admin?
  end

  def readable_by?(user)
    return user.can?(:view_draft_projects) if resource.draft?
    true
  end

end
