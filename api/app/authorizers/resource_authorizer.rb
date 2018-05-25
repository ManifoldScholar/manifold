class ResourceAuthorizer < ProjectChildAuthorizer

  def updatable_by?(user, _options = {})
    resource.project.resources_manageable_by? user
  end

end
