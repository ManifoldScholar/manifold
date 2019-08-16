class ReadingGroupMembershipAuthorizer < ApplicationAuthorizer

  # There are cases where all users can CRUD annotations.
  def self.default(_able, _user, _options = {})
    true
  end

  def self.readable_by?(_user, _options = {})
    true
  end

  def creatable_by?(user, _options = {})
    known_user?(user)
  end

  def deletable_by?(user, _options = {})
    resource.reading_group.updatable_by?(user)
  end

  def updatable_by?(user, _options = {})
    resource.reading_group.updatable_by?(user)
  end

  def readable_by?(user, _options = {})
    resource.reading_group.users.exists?(user)
  end

end
