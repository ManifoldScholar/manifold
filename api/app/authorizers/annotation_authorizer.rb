class AnnotationAuthorizer < ApplicationAuthorizer

  # There are cases where all users can CRUD annotations.
  def self.default(_able, _user, _options = {})
    true
  end

  def creatable_by?(user, _options = {})
    return known_user?(user) unless Annotation::NOTATION_TYPES.include?(resource.format)
    resource&.text&.notatable_by? user || false
  end

  def deletable_by?(user, _options = {})
    return user.created? resource if resource.highlight?
    return resource&.text&.notatable_by?(user) if
      Annotation::NOTATION_TYPES.include?(resource.format)
    creator_or_has_editor_permissions?(user, resource)
  end

  def updatable_by?(user, _options = {})
    return resource&.text&.notatable_by?(user) if
      Annotation::NOTATION_TYPES.include?(resource.format)
    creator_or_has_editor_permissions?(user, resource)
  end

  def readable_by?(user, _options = {})
    return true if user.created?(resource)
    resource.public?
  end
end
