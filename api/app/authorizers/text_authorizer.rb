# frozen_string_literal: true

# @see Text
class TextAuthorizer < ProjectPropertyAuthorizer
  expose_abilities [:notate, :engage_publicly, :manage_resources]

  delegate :ignore_access_restrictions?, to: :resource
  delegate :readable_by?, to: :project, allow_nil: true, prefix: true
  delegate :resources_manageable_by?, to: :project, allow_nil: true, prefix: true

  def notatable_by?(user, options = {})
    project_editor_or_author?(user) || manageable_by?(user, options)
  end

  def readable_by?(user, options = {})
    return true if ignore_access_restrictions? && project_readable_by?(user, options)

    super
  end

  # @see ProjectAuthorizer#texts_creatable_by?
  def specifically_creatable_by?(user, options = {})
    with_project do |p|
      p.texts_creatable_by?(user, options)
    end
  end

  # @see ProjectAuthorizer#texts_manageable_by?
  def specifically_manageable_by?(user, options = {})
    with_project do |p|
      p.texts_manageable_by?(user, options)
    end
  end
end
