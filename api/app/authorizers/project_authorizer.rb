class ProjectAuthorizer < ApplicationAuthorizer

  expose_abilities [:read_drafts, :read_log, :update_resources, :update_makers,
                    :update_permissions, :update_limited_to_resource_metadata]

  # Any user who is a project_editor might be able to create, update, or delete it.
  def self.default(_able, _user, _options = {})
    true
  end

  # Only admins, editors, and project creators can create projects.
  def self.creatable_by?(user, _options = {})
    project_creator_permissions?(user)
  end

  def self.drafts_readable_by?(user, _options = {})
    marketeer_permissions?(user)
  end

  # We're putting this scope here to keep it as close as possible to the ability defined
  # below.
  def self.scope_updatable_projects(user)
    return Project.all if marketeer_permissions?(user)
    Project.with_roles(
      [Role::ROLE_PROJECT_RESOURCE_EDITOR, Role::ROLE_PROJECT_EDITOR], user
    )
  end

  # All backend user types can edit projects, plus editors of the specific project.
  def updatable_by?(user, _options = {})
    marketeer_permissions?(user) ||
      user.project_editor_of?(resource)
  end

  # Admins, editors, and project-specific editors can delete those projects.
  def deletable_by?(user, _options = {})
    editor_permissions?(user) ||
      user.project_editor_of?(resource)
  end

  # Non-draft projects are readable. Otherwise, the user must have a role or relation to
  # the project to see it.
  def readable_by?(user, options = {})
    return true unless resource.draft?
    drafts_readable_by?(user, options)
  end

  def drafts_readable_by?(user, _options = {})
    marketeer_permissions?(user) ||
      user.project_editor_of?(resource) ||
      user.project_resource_editor_of?(resource)
  end

  def log_readable_by?(user, _options = {})
    marketeer_permissions?(user) ||
      user.project_editor_of?(resource)
  end

  def resources_updatable_by?(user, _options = {})
    updatable_by?(user) ||
      user.project_resource_editor_of?(resource)
  end

  def only_resource_metadata_updatable_by?(user, _options = {})
    !updatable_by?(user) &&
      user.project_resource_editor_of?(resource)
  end

  def makers_updatable_by?(user, _options = {})
    updatable_by?(user)
  end

  def permissions_updatable_by?(user, _options = {})
    editor_permissions?(user) ||
      user.project_editor_of?(resource)
  end

end
