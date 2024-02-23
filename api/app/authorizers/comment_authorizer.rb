# frozen_string_literal: true

# @see Comment
class CommentAuthorizer < ApplicationAuthorizer
  requires_trusted_or_established_user!

  expose_abilities [:read_deleted]

  def creatable_by?(user, options = {})
    return comment_is_on_readable_annotation_for?(user) if comment_is_on_annotation?

    parent_project_is_publicly_engageable_by?(user, options)
  end

  def readable_by?(user, options = {})
    return comment_is_on_readable_annotation_for?(user) if comment_is_on_annotation?

    parent_project_is_publicly_engageable_by?(user, options)
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

  private

  def comment_is_on_readable_annotation_for?(user)
    comment_is_on_annotation? && resource.subject.readable_by?(user)
  end

  def parent_project_is_publicly_engageable_by?(user, options)
    with_project { |p| p.publicly_engageable_by? user, options }
  end

  def comment_is_on_annotation?
    resource.on_annotation?
  end

  class << self
    def readable_by?(...)
      true
    end

    def creatable_by?(user, _options = {})
      trusted_or_established_user?(user)
    end

    def default(_able, user, _options = {})
      authenticated?(user)
    end
  end
end
