class ProjectChildAuthorizer < ApplicationAuthorizer

  # Without a specified project that we can check the user's permissions on, it's
  # conceivable that a :reader could do anything to a project.
  def self.default(_able, _user, _options = {})
    true
  end

  def default(_able, user, _options = {})
    resource.project.updatable_by? user
  end

  def deletable_by?(user, _options = {})
    resource.project.updatable_by? user
  end

  # Most, if not all, things that are on the project are readable if the project is
  # readable. Note: the delegation to the project will ensure that the child inherits
  # the draft visibility from the parent.
  def readable_by?(user, _options = {})
    resource.project.readable_by? user
  end

end
