class ReadingGroupMembershipAuthorizer < ApplicationAuthorizer
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
    return true if user.id == resource.user_id

    resource.reading_group.updatable_by?(user)
  end

  def readable_by?(user, _options = {})
    return false if user.blank?
    return false if reading_groups_disabled?
    return true if admin_permissions?(user)

    resource.reading_group.users.where(id: user).exists?
  end

  class << self
    # There are cases where all users can CRUD annotations.
    def default(_able, _user, _options = {})
      true
    end

    def readable_by?(user, options = {})
      return false if reading_groups_disabled?

      return true if admin_permissions? user

      if options[:reading_group]
        options[:reading_group].users.where(id: user).exists?
      else
        true
      end
    end
  end
end
