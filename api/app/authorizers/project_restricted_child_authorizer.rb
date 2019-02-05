class ProjectRestrictedChildAuthorizer < ProjectChildAuthorizer

  # This one is a bit more complex. Restricted children can be read by users who can
  # update the project. Controllers will need to pass in the project. For example:
  # authorize_action_for TwitterQuery, for: @project
  def self.readable_by?(user, options = {})
    return true if editor_permissions?(user)
    return false unless options[:for]

    options[:for].resources_manageable_by? user
  end

  # A project's restricted children are not readable unless the user can update the
  # project.
  def readable_by?(user, _options = {})
    resource.project.updatable_by? user
  end

end
