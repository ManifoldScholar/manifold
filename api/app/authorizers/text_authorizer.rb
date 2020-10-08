class TextAuthorizer < ProjectChildAuthorizer

  expose_abilities [:notate, :engage_publicly]

  def notatable_by?(user, _options = {})
    user.project_editor_of?(resource.project) ||
      user.project_author_of?(resource.project) ||
      resource.project.resources_manageable_by?(user)
  end

  def readable_by?(user, options = {})
    return true if resource.ignore_access_restrictions && resource.project.readable_by?(user)

    with_project { |p| p.fully_readable_by? user, options }
  end

end
