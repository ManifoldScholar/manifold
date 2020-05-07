# This is a shared authorizer for dependents of {Project projects}
# that all share the same sort of
class ProjectChildAuthorizer < ApplicationAuthorizer
  # By default, we defer to {ProjectAuthorizer#updatable_by?}.
  def default(_adjective, user, options = {})
    with_project { |p| p.updatable_by? user, options }
  end

  # Project children can be deleted if the user can **update** the project,
  # they do not have to be able to delete the project itself.
  #
  # @see ProjectAuthorizer#updatable_by?
  def deletable_by?(user, options = {})
    with_project { |p| p.updatable_by? user, options }
  end

  # Most, if not all, things that are on the project are readable if the project is
  # readable. Note: the delegation to the project will ensure that the child inherits
  # the draft visibility from the parent.
  #
  # @see ProjectAuthorizer#readable_by?
  def readable_by?(user, options = {})
    with_project { |p| p.fully_readable_by? user, options }
  end

  # @see ProjectAuthorizer#fully_readable_by?
  def fully_readable_by?(user, options = {})
    with_project { |p| p.fully_readable_by? user, options }
  end

  def publicly_engageable_by?(user, options = {})
    with_project { |p| p.publicly_engageable_by? user, options }
  end

  class << self
    # Without a specified project that we can check the user's permissions on, it's
    # conceivable that a user could do anything to a project's child.
    def default(_adjective, _user, _options = {})
      true
    end
  end
end
