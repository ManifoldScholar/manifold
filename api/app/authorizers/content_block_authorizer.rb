class ContentBlockAuthorizer < ProjectRestrictedChildAuthorizer

  def deletable_by?(user, _options = {})
    return false if resource.type == "Content::HeroBlock"
    super
  end

end
