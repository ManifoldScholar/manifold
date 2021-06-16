class ReadingGroupCategoryAuthorizer < ApplicationAuthorizer
  config.allowed_by_default = true

  # This will defer to the associated {ReadingGroup}.
  #
  # @param [Symbol] able
  # @param [User] user
  # @param [Hash] options
  # @return [Boolean]
  def default(able, user, options = {})
    return false if resource.reading_group.blank?

    resource.reading_group.public_send(:"#{able}_by?", user, options)
  end

  class << self
    def readable_by?(_user, _options = {})
      !reading_groups_disabled?
    end

    # @param [User] user
    def listable_by?(user, _options = {})
      admin_permissions? user
    end
  end
end
