class TextAuthorizer < ProjectChildAuthorizer

  expose_abilities [:notate]

  def notatable_by?(user, _options = {})
    editor_permissions?(user) ||
      user.project_editor_of?(resource.project) ||
      user.project_author_of?(resource.project)
  end

end
