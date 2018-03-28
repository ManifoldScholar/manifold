class AnnotationAuthorizer < ApplicationAuthorizer

  # There are cases where all users can CRUD annotations.
  def self.default(_able, _user, _options = {})
    true
  end

  def creatable_by?(user, _options = {})
    return true unless Annotation::NOTATION_TYPES.include?(resource.format)
    editor_permissions?(user)
  end

  def deletable_by?(user, _options = {})
    return user.created? resource if resource.highlight?
    creator_or_has_editor_permissions?(user, resource)
  end

  def updatable_by?(user, _options = {})
    creator_or_has_editor_permissions?(user, resource)
  end
end
