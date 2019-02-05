class UserAuthorizer < ApplicationAuthorizer

  def self.default(_able, user, _options = {})
    admin_permissions?(user)
  end

  def self.readable_by?(user, _options = {})
    editor_permissions?(user) ||
      editor_of_any_project?(user)
  end

  def self.creatable_by?(user, _options = {})
    return true unless user

    admin_permissions?(user)
  end

  def updatable_by?(user, _options = {})
    admin_permissions?(user) ||
      resource == user
  end

  # Editors on projects can set permissions, which means they need access to users.
  def readable_by?(user, _options = {})
    editor_permissions?(user) ||
      editor_of_any_project?(user) ||
      resource == user
  end

end
