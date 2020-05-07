class ResourceAuthorizer < ProjectChildAuthorizer

  expose_abilities [:notate, :engage_publicly]

  def updatable_by?(user, _options = {})
    resource.project.resources_manageable_by? user
  end

end
