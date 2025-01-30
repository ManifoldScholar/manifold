# frozen_string_literal: true

# @see Resource
class ResourceAuthorizer < ProjectPropertyAuthorizer
  expose_abilities [:notate, :engage_publicly]

  # @see ProjectAuthorizer#resources_creatable_by?
  def specifically_creatable_by?(user, options = {})
    with_project do |p|
      p.resources_creatable_by?(user, options)
    end
  end

  # @see ProjectAuthorizer#resources_manageable_by?
  def specifically_manageable_by?(user, options = {})
    with_project do |p|
      p.resources_manageable_by?(user, options)
    end
  end
end
