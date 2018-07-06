# Other authorizers should subclass this one
class ApplicationAuthorizer < Authority::Authorizer

  include Concerns::SerializableAuthorization

  delegate :admin_permissions?, :editor_permissions?,
           :project_creator_permissions?, :marketeer_permissions?,
           :creator_or_has_editor_permissions?, :reader_permissions?,
           :creator_or_has_admin_permissions?,
           :editor_of_any_project?, to: :class

  # Any class method from Authority::Authorizer that isn't overridden
  # will call its authorizer's default method.
  #
  # @param [Symbol] adjective; example: `:creatable`
  # @param [Object] user - whatever represents the current user in your app
  # @return [Boolean]
  def self.default(_adjective, _user)
    # 'Whitelist' strategy for security: anything not explicitly allowed is
    # considered forbidden.
    false
  end

  def self.authorizes_to_send_test_mail?(user)
    admin_permissions?(user)
  end

  def self.admin_permissions?(user)
    user.admin?
  end

  def self.editor_permissions?(user)
    admin_permissions?(user) || user.editor?
  end

  def self.project_creator_permissions?(user)
    editor_permissions?(user) || user.project_creator?
  end

  def self.marketeer_permissions?(user)
    editor_permissions?(user) || user.marketeer?
  end

  def self.reader_permissions?(user)
    project_creator_permissions?(user) ||
      marketeer_permissions?(user) ||
      user.reader?
  end

  def self.creator_or_has_editor_permissions?(user, resource)
    user.created?(resource) || editor_permissions?(user)
  end

  def self.creator_or_has_admin_permissions?(user, resource)
    user.created?(resource) || admin_permissions?(user)
  end

  def self.editor_of_any_project?(user)
    user.has_role? Role::ROLE_PROJECT_EDITOR, :any
  end

  protected

  def resource_belongs_to_updatable_project?(user, resource)
    resource.projects.any? do |project|
      user.can_update? project
    end
  end

end
