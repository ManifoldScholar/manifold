class CommentAuthorizer < ApplicationAuthorizer

  expose_abilities [:read_deleted]

  def self.default(_able, _user, _options = {})
    true
  end

  def creatable_by?(user, options = {})
    with_project { |p| p.publicly_engageable_by? user, options }
  end

  def readable_by?(user, options = {})
    with_project { |p| p.publicly_engageable_by? user, options }
  end

  def deletable_by?(user, _options = {})
    creator_or_has_editor_permissions?(user, resource)
  end

  def updatable_by?(user, _options = {})
    creator_or_has_admin_permissions?(user, resource)
  end

  def deleted_readable_by?(user, _options = {})
    editor_permissions?(user)
  end

end
