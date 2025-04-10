# frozen_string_literal: true

# An authorizer for {Project} that also controls access to a number of other
# models owned or otherwise associated to a project.
#
# @see ProjectChildAuthorizer
# @see ProjectProperty
# @see ProjectPropertyAuthorizer
class ProjectAuthorizer < ApplicationAuthorizer
  expose_abilities [
    :read_drafts, :read_log, :manage_resources, :create_resources,
    :manage_resource_collections, :create_resource_collections,
    :manage_permissions, :create_permissions, :manage_texts,
    :create_texts, :manage_twitter_queries, :create_twitter_queries,
    :manage_events, :manage_socials, :update_makers, :manage_project_exportations,
    :create_entitlements, :manage_entitlements, :fully_read,
    :create_project_exportations, :engage_publicly
  ]

  SOCIALS = %i[twitter_queries].freeze
  SOCIAL_ABILITIES = SOCIALS.flat_map do |social|
    [
      :"#{social}_manageable_by?",
      :"#{social}_creatable_by?"
    ]
  end.freeze

  # @note This should not actually be caught by any verbs for this model,
  #   but we add it here to prevent the authorizer from short-circuiting
  #   to the necessarily-permissive class-level {ProjectAuthorizer.default}.
  def default(_adjective, user, _options = {})
    # :nocov:
    has_any_role?(user, :admin)
    # :nocov:
  end

  # Admins, editors, marketeers, and project creators can create projects.
  #
  # @param [User] user
  # @param [Hash] _options
  def creatable_by?(user, _options = {})
    has_any_role?(user, :admin, :editor, :marketeer, :project_creator)
  end

  # First, we check to see if the project is a draft. If so, {#drafts_readable_by? it must be readable}.
  # Otherwise, we allow a project to be read.
  #
  # @see #drafts_readable_by
  # @see #fully_readable_by?
  # @param [User] user
  # @param [Hash] _options
  def readable_by?(user, options = {})
    return drafts_readable_by?(user, options) if resource.draft?

    true
  end

  # All backend user types can edit projects, plus editors of the specific project.
  #
  # @param [User] user
  # @param [Hash] _options
  def updatable_by?(user, options = {})
    has_any_role?(user, :admin, :editor, :marketeer, :project_editor) || with_journal { |j| j.updatable_by? user, options }
  end

  # @!group Project Property Access Control

  # Whether things like {Text}s, {Resource}s, and {ResourceCollection}s
  # can be managed by the given {User}.
  #
  # @see RoleName::ProjectPropertyManager
  # @param [User] user
  # @param [Hash] options
  def properties_manageable_by?(user, options = {})
    updatable_by?(user, options) || has_role?(user, :project_property_manager)
  end

  alias properties_creatable_by? properties_manageable_by?

  alias resources_creatable_by? properties_manageable_by?
  alias resources_manageable_by? properties_manageable_by?
  alias resource_collections_manageable_by? properties_manageable_by?
  alias resource_collections_creatable_by? properties_manageable_by?
  alias texts_manageable_by? properties_manageable_by?
  alias texts_creatable_by? properties_manageable_by?

  # @!endgroup

  alias twitter_queries_creatable_by? updatable_by?
  alias twitter_queries_manageable_by? updatable_by?
  alias events_manageable_by? updatable_by?
  alias events_creatable_by? updatable_by?
  alias makers_updatable_by? updatable_by?
  alias log_readable_by? updatable_by?

  def project_administered_by?(user, _options = {})
    creator_or_has_editor_permissions?(user, resource)
  end

  alias project_exportations_manageable_by? project_administered_by?
  alias project_exportations_creatable_by? project_administered_by?
  alias permissions_creatable_by? project_administered_by?
  alias permissions_manageable_by? project_administered_by?

  # @see EntitlementAuthorizer.creatable_by?
  # @param [User] user
  # @param [Hash] options
  def entitlements_creatable_by?(user, options = {})
    return false if resource.draft? && !has_any_role?(user, :admin, :editor)
    options ||= {}

    options[:for] = resource

    user.can_create? Entitlement, options
  end

  # @see EntitlementAuthorizer.manageable_by?
  # @param [User] user
  # @param [Hash] options
  def entitlements_manageable_by?(user, options = {})
    return false if resource.draft? && !has_any_role?(user, :admin, :editor)
    options ||= {}

    options[:for] = resource

    user.can_manage? Entitlement, options
  end

  # {RoleName::Admin Admins} and {RoleName::Editor editors} can delete any project.
  #
  # {RoleName::ProjectEditor Project editors} can delete any project that they have access to.
  #
  # @param [User] user
  # @param [Hash] _options
  def deletable_by?(user, options = {})
    has_any_role?(user, :admin, :editor, :project_editor) || with_journal { |j| j.deletable_by? user, options }
  end

  # @see RoleName.draft_access
  # @param [User] user
  # @param [Hash] _options
  def drafts_readable_by?(user, options = {})
    has_any_role?(user, *RoleName.draft_access) || with_journal { |j| j.readable_by? user, options }
  end

  def publicly_engageable_by?(user, _options = {})
    return false if resource.disable_engagement? || Settings.instance.general.disable_engagement?

    trusted_or_established_user?(user)
  end

  # @note If a project does not have restricted access, this always returns true.
  #
  # @see RoleName.full_read_access
  # @param [User] user
  # @param [Hash] _options
  def fully_readable_by?(user, options = {})
    return false unless readable_by?(user, options)

    if Settings.instance.general["restricted_access"]
      return true if resource.open_access?
    else
      return true unless resource.restricted_access?
    end

    has_any_role? user, *RoleName.full_read_access
  end

  # Can the user manage or create any of the entities
  # on the project social integrations tab?
  #
  # @see SOCIAL_ABILITIES
  # @param [User] user
  # @param [Hash] _options
  def socials_manageable_by?(user, _options = {})
    SOCIAL_ABILITIES.any? do |social_ability|
      public_send social_ability, user
    end
  end

  class << self
    # Any user who is a project_editor might be able to create, update, or delete it.
    #
    # @param [Symbol] _adjective
    # @param [User] _user
    # @param [Hash] _options
    def default(_adjective, _user, _options = {})
      true
    end

    # Only admins, editors, and project creators can create projects.
    #
    # @param [User] user
    # @param [Hash] _options
    def creatable_by?(user, _options = {})
      project_creator_permissions?(user) || user.journal_editor?
    end

    # {RoleName::Admin Admins} and {RoleName::Editor editors} can delete any project.
    #
    # {RoleName::ProjectEditor Project editors} can delete any project that they have access to.
    #
    # @param [User] user
    # @param [Hash] _options
    def deletable_by?(user, _options = {})
      has_any_role?(user, :admin, :editor, :project_editor)
    end

    # @see .marketeer_permissions?
    # @param [User] user
    # @param [Hash] _options
    def drafts_readable_by?(user, _options = {})
      marketeer_permissions?(user)
    end

    # @see Project.build_read_ability_scope_for
    # @param [User] user
    # @param [Hash] _options
    def fully_readable_by(user, _options = {})
      Project.with_read_ability(user).exists?
    end
  end
end
