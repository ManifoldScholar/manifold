class TextTrackAuthorizer < ProjectPropertyAuthorizer
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
