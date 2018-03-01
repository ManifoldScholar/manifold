class SettingsAuthorizer < ApplicationAuthorizer

  expose_abilities [:read_secrets]

  # Singleton settings can't be created or deleted, guy.
  def self.default(_user, _options = {})
    false
  end

  def self.updatable_by?(user, _options = {})
    admin_permissions?(user)
  end

  def self.readable_by?(_user, _options = {})
    true
  end

  def secrets_readable_by(user, _options = {})
    admin_permissions?(user)
  end

end
