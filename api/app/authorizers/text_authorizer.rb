class TextAuthorizer < ProjectChildAuthorizer

  expose_abilities [:notate]

  def notatable_by?(user, _options = {})
    user.project_editor_of?(resource.project) ||
      user.project_author_of?(resource.project) ||
      resource.project.resources_manageable_by?(user)
  end

end
