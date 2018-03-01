class ResourceAuthorizer < ProjectChildAuthorizer

  expose_abilities [:update_limited_to_resource_metadata]

  def updatable_by?(user, _options = {})
    resource.project.resources_updatable_by? user
  end

  def only_resource_metadata_updatable_by?(user, _options = {})
    !resource.project.updatable_by?(user) &&
      user.project_resource_editor_of?(resource.project)
  end

end
