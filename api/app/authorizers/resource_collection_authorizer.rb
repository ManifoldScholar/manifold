# frozen_string_literal: true

# @see ResourceCollection
class ResourceCollectionAuthorizer < ProjectPropertyAuthorizer
  # @see ProjectAuthorizer#resource_collections_creatable_by?
  def specifically_creatable_by?(user, options = {})
    with_project do |p|
      p.resource_collections_creatable_by?(user, options)
    end
  end

  # @see ProjectAuthorizer#resource_collections_manageable_by?
  def specifically_manageable_by?(user, options = {})
    with_project do |p|
      p.resource_collections_manageable_by?(user, options)
    end
  end
end
