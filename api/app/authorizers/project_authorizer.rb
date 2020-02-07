class ProjectAuthorizer < ApplicationAuthorizer

  expose_abilities [:read_drafts, :read_log, :manage_resources, :create_resources,
                    :manage_resource_collections, :create_resource_collections,
                    :manage_permissions, :create_permissions, :manage_texts,
                    :create_texts, :manage_twitter_queries, :create_twitter_queries,
                    :manage_events, :manage_socials, :update_makers, :manage_project_exportations,
                    :create_project_exportations]

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
  alias resources_creatable_by? updatable_by?
  alias resource_collections_manageable_by? updatable_by?
  alias resource_collections_creatable_by? updatable_by?
  alias texts_manageable_by? updatable_by?
  alias texts_creatable_by? updatable_by?
  alias twitter_queries_creatable_by? updatable_by?
  alias twitter_queries_manageable_by? updatable_by?
  alias events_manageable_by? updatable_by?
  alias events_creatable_by? updatable_by?
  alias makers_updatable_by? updatable_by?
  alias log_readable_by? updatable_by?

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

  def resources_manageable_by?(user, _options = {})
    updatable_by?(user) ||
      user.project_resource_editor_of?(resource)
  end

  def permissions_manageable_by?(user, _options = {})
    creator_or_has_editor_permissions?(user, resource)
  end
  alias permissions_creatable_by? permissions_manageable_by?

  # Can the user manage or create any of the entities
  # on the project social integrations tab?
  def socials_manageable_by?(user, _options = {})
    socials = %w(twitter_queries)
    socials.detect do |social|
      __send__("#{social}_manageable_by?", user) ||
        __send__("#{social}_creatable_by?", user)
    end.present?
  end

end
