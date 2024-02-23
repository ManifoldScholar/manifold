# frozen_string_literal: true

# Other authorizers should subclass this one
#
# @abstract
class ApplicationAuthorizer < Authority::Authorizer
  include ActiveSupport::Configurable
  include SerializableAuthorization

  config.allowed_by_default = false

  delegate(
    :admin_permissions?, :editor_permissions?,
    :project_creator_permissions?, :marketeer_permissions?,
    :creator_or_has_editor_permissions?, :reader_permissions?,
    :creator_or_has_admin_permissions?,
    :creator_or_has_marketeer_permissions?,
    :editor_of_any_project?,
    :trusted_or_established_user?,
    :authenticated?,
    to: :class
  )

  def has_any_role?(user, *roles, on: resource)
    roles.flatten.any? do |role|
      has_role?(user, role, on: on)
    end
  end

  # @see .has_role?
  # @param [User] user
  # @param [RoleName] role
  # @param [Rolify::Resource] on
  def has_role?(user, role, on: resource)
    self.class.has_role? user, role, on: on
  end

  private

  def known_user?(user)
    user.role.present?
  end

  # @param [User] user
  def trusted_or_established_user?(user)
    return false if user.blank?

    user.established? || user.trusted?
  end

  # @param [User] user
  # @param [#projects] resource
  def resource_belongs_to_updatable_project?(user, resource)
    resource.projects.any? do |project|
      user.can_update? project
    end
  end

  def reading_groups_disabled?
    self.class.reading_groups_disabled?
  end

  # @yield [project] do something with a project if it is present on the resource.
  # @yieldparam [Project] project
  # @yieldreturn [Boolean]
  # @return [Boolean]
  def with_project
    project = resource.project

    return false if project.blank?

    project.then(&Proc.new)
  end

  # @yield [journal] do something with a journal if it is present on the resource.
  # @yieldparam [Journal] journal
  # @yieldreturn [Boolean]
  # @return [Boolean]
  def with_journal
    journal = resource.journal

    return false if journal.blank?

    journal.then(&Proc.new)
  end

  class << self
    # @param [User, AnonymousUser, nil] user
    def authenticated?(user)
      user.present? && user.kind_of?(User) && user.persisted?
    end

    # Any class method from Authority::Authorizer that isn't overridden
    # will call its authorizer's default method.
    #
    # @param [Symbol] _adjective example: `:creatable`
    # @param [User] _user
    # @param [Hash] _options
    # @return [Boolean]
    def default(_adjective, _user, _options = {})
      # 'Whitelist' strategy for security: anything not explicitly allowed is
      # considered forbidden.
      config.allowed_by_default
    end

    def reading_groups_disabled?
      Settings.instance.general[:disable_reading_groups]
    end

    # @see RoleName::Admin
    # @param [User] user
    def admin_permissions?(user)
      return false if user.blank?

      user.admin?
    end

    # @see .admin_permissions?
    #
    # @param [User] user
    def authorizes_to_send_test_mail?(user)
      admin_permissions?(user)
    end

    # @see .admin_permissions?
    # @see RoleName::Editor
    # @param [User] user
    def editor_permissions?(user)
      admin_permissions?(user) || user.editor?
    end

    # @see .editor_permissions?
    # @see RoleName::ProjectCreator
    # @param [User] user
    def project_creator_permissions?(user)
      editor_permissions?(user) || user.project_creator?
    end

    # @see .editor_permissions?
    # @see RoleName::Marketeer
    # @param [User] user
    def marketeer_permissions?(user)
      editor_permissions?(user) || user.marketeer?
    end

    # @see .project_creator_permissions?
    # @see .marketeer_permissions?
    # @see RoleName::Reader
    # @param [User] user
    def reader_permissions?(user)
      project_creator_permissions?(user) ||
        marketeer_permissions?(user) ||
        user.reader?
    end

    # @see .admin_permissions?
    # @see User#created?
    # @param [User] user
    # @param [ApplicationRecord] resource
    def creator_or_has_admin_permissions?(user, resource)
      user.created?(resource) || admin_permissions?(user)
    end

    # @see .editor_permissions?
    # @see User#created?
    # @param [User] user
    # @param [ApplicationRecord] resource
    def creator_or_has_editor_permissions?(user, resource)
      user.created?(resource) || editor_permissions?(user)
    end

    # @see .marketeer_permissions?
    # @see User#created?
    # @param [User] user
    # @param [ApplicationRecord] resource
    def creator_or_has_marketeer_permissions?(user, resource)
      user.created?(resource) || marketeer_permissions?(user)
    end

    # @see .has_role?
    # @param [User] user
    def editor_of_any_project?(user)
      has_role? user, :project_editor
    end

    # @see .has_role?
    # @param [User] user
    # @param [<RoleName, String, Symbol>] roles
    # @param [Rolify::Resource, :any] on
    def has_any_role?(user, *roles, on: :any)
      roles.flatten.any? do |role|
        has_role?(user, role, on: on)
      end
    end

    # This will determine how to compare a given role.
    #
    # For roles that {RoleName#acts_global? act global},
    # it will compare against `:any`, because we don't
    # actually want to scope that against a resource.
    #
    # Otherwise, it will compare against the provided `on`.
    # In a class-level authorizer check, that `on` is `:any`
    # by default, but in an instance-level check, it will
    # inherit the currently authorizing resource (unless overriden).
    #
    # @param [User] user
    # @param [RoleName, String, Symbol] role
    # @param [Rolify::Resource, :any] on
    def has_role?(user, role, on: :any)
      return false if user.nil?

      role_name = RoleName.fetch role

      actual_on = role_name.acts_global? ? :any : on

      user.has_cached_role? role, actual_on
    end

    # @param [User] user
    def trusted_or_established_user?(user)
      return false if user.blank?

      user.established? || user.trusted?
    end

    # Authorizers that should override their create check
    # in order to ensure that a user has been trusted or
    # established in the instance in order to create the
    # associated resource.
    #
    # @return [void]
    def requires_trusted_or_established_user!
      include RequiresTrustedOrEstablishedUser
    end
  end

  # @api private
  module RequiresTrustedOrEstablishedUser
    extend ActiveSupport::Concern

    included do
      prepend RequiresTrustedOrEstablishedUser::WrapperMethods
    end

    # Override this in authorizers where only certain models
    # require a reputation in order to create them.
    #
    # For instance, public reading groups.
    # @abstract
    def requires_reputation_to_create?
      true
    end

    # Boolean complement of {#requires_reputation_to_create?},
    # defined for legibility.
    def requires_no_reputation_to_create?
      !requires_reputation_to_create?
    end

    # This module gets prepended during inclusion
    #
    # @api private
    module WrapperMethods
      def creatable_by?(user, options = {})
        return false unless requires_no_reputation_to_create? || trusted_or_established_user?(user)

        super
      end
    end
  end
end
