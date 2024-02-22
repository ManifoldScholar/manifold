# frozen_string_literal: true

# @see ReadingGroup
class ReadingGroupAuthorizer < ApplicationAuthorizer
  requires_trusted_or_established_user!

  def creatable_by?(user, _options = {})
    return false unless known_user?(user)
    return false if reading_groups_disabled?

    resource.creator.nil? || resource.creator == user
  end

  def deletable_by?(user, _options = {})
    creator_or_has_admin_permissions?(user, resource)
  end

  def updatable_by?(user, _options = {})
    creator_or_has_admin_permissions?(user, resource) || moderator?(user)
  end

  def readable_by?(user, _options = {})
    return false if reading_groups_disabled?

    return true if resource.public?

    creator_or_has_admin_permissions?(user, resource) || resource.users.include?(user)
  end

  private

  # Only public reading groups need reputation to create.
  def requires_reputation_to_create?
    resource.public?
  end

  def moderator?(user)
    user.has_role?(:moderator, resource)
  end

  class << self
    def default(_able, _user, _options = {})
      true
    end

    def readable_by?(_user, _options = {})
      !reading_groups_disabled?
    end

    def listable_by?(user, _options = {})
      admin_permissions?(user)
    end
  end
end
