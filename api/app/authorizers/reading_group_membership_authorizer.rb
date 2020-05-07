class ReadingGroupMembershipAuthorizer < ApplicationAuthorizer

  # There are cases where all users can CRUD annotations.
  def self.default(_able, _user, _options = {})
    true
  end

  def self.readable_by?(_user, _options = {})
    true
  end

  def creatable_by?(user, _options = {})
    return false unless known_user?(user)
    return false if reading_groups_disabled?
    return true if resource.user_id == user.id

    admin_permissions? user
  end

  def deletable_by?(user, _options = {})
    return false unless known_user?(user)
    return false if resource.user_id == resource.reading_group.creator_id
    return true if resource.user_id == user.id

    admin_permissions? user
  end

  def updatable_by?(user, _options = {})
    return false if reading_groups_disabled?

    resource.reading_group.updatable_by?(user)
  end

  def readable_by?(user, _options = {})
    return false if reading_groups_disabled?

    resource.reading_group.users.exists?(user)
  end

end
