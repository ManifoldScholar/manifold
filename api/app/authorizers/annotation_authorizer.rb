# frozen_string_literal: true

# @see Annotation
class AnnotationAuthorizer < ApplicationAuthorizer
  requires_trusted_or_established_user!

  # rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def creatable_by?(user, _options = {})
    return false unless known_user?(user)

    allowed = true
    allowed = false if annotation_in_reading_group? && reading_groups_disabled?
    allowed = false if !annotation_is_resource_annotation? &&
                       !resource.project&.publicly_engageable_by?(user) &&
                       !annotation_in_reading_group? && annotation_is_public?
    allowed = false if annotation_in_reading_group? && user_is_not_in_reading_group?(user)
    allowed = false if annotation_is_resource_annotation? && !user_can_notate_text?(user)
    allowed
  end
  # rubocop:enable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity

  def deletable_by?(user, _options = {})
    return user.created? resource if resource.highlight?
    return resource&.text&.notatable_by?(user) if
      Annotation::NOTATION_TYPES.include?(resource.format)

    creator_or_has_editor_permissions?(user, resource)
  end

  def updatable_by?(user, _options = {})
    return false if annotation_in_reading_group? && reading_groups_disabled?
    return resource&.text&.notatable_by?(user) if
      Annotation::NOTATION_TYPES.include?(resource.format)

    creator_or_has_editor_permissions?(user, resource)
  end

  def readable_by?(user, _options = {})
    return false if annotation_in_reading_group? && reading_groups_disabled?
    return true if user&.created?(resource)
    return user_is_in_reading_group?(user) if annotation_in_reading_group? && reading_group_is_private?

    resource.public?
  end

  private

  # Only public annotations need reputation to create.
  def requires_reputation_to_create?
    return true if annotation_is_public? && !annotation_in_reading_group?
    return true if annotation_in_reading_group? && !reading_group_is_private?

    false
  end

  def user_can_notate_text?(user)
    resource&.text&.notatable_by? user
  end

  def annotation_is_resource_annotation?
    Annotation::NOTATION_TYPES.include?(resource.format)
  end

  def annotation_is_public?
    resource.public?
  end

  def annotation_in_reading_group?
    resource.reading_group_id.present?
  end

  def reading_group_is_private?
    resource.reading_group.private?
  end

  def user_is_in_reading_group?(user)
    !user_is_not_in_reading_group?(user)
  end

  def user_is_not_in_reading_group?(user)
    resource.reading_group.users.exclude? user
  end

  class << self
    # There are cases where all users can CRUD annotations.
    def default(_able, _user, _options = {})
      true
    end
  end
end
