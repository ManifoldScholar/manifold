# frozen_string_literal: true

# @see User
class UserAuthorizer < ApplicationAuthorizer
  # @note This ensures a user cannot bulk delete themselves.
  def bulk_deletable_by?(user, options = {})
    resource != user && super
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

  class << self
    def default(_able, user, _options = {})
      admin_permissions?(user)
    end

    def readable_by?(user, _options = {})
      editor_permissions?(user) ||
        editor_of_any_project?(user)
    end

    def creatable_by?(user, _options = {})
      return true unless user

      admin_permissions?(user)
    end
  end
end
