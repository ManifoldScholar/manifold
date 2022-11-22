class TextSectionAuthorizer < ProjectChildAuthorizer

  expose_abilities [:engage_publicly]

  def readable_by?(user, options = {})
    return false unless resource&.text.present?

    resource.text.readable_by?(user, options)
  end

end
