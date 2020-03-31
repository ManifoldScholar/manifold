# @see Entitlement
class EntitlementAuthorizer < ApplicationAuthorizer
  # @param [Symbol] _adjective
  # @param [User] user
  # @param [Hash] _options
  # @return [Boolean]
  def default(_adjective, user, _options = {})
    return true if provided_by?(user)

    has_editor_or_default_subject_abilities? user
  end

  def creatable_by?(user, _options = {})
    resource.entitling_user == user
  end

  def readable_by?(user, options = {})
    provides_to?(user) || default(:readable, user, options)
  end

  def manageable_by?(user, _options = {})
    has_editor_or_default_subject_abilities?(user)
  end

  def updatable_by?(_user, _options = {})
    false
  end

  private

  def provided_by?(user)
    resource.entitling_user == user
  end

  def provides_to?(user)
    user.in?(resource.users)
  end

  def has_editor_or_default_subject_abilities?(user)
    return true if provided_by?(user)
    return true if editor_permissions?(user)

    resource.on_subject do |m|
      m.project do |(project, _)|
        project.creator == user
      end

      m.project_collection { false }
      m.system_entitlement { false }
    end
  end

  class << self
    # @param [Symbol] _adjective
    # @param [User] user
    # @param [Hash] _options
    # @return [Boolean]
    def default(_adjective, user, _options = {})
      might_access? user
    end

    # @param [User] user
    # @param [Hash] _options
    def creatable_by?(user, _options = {})
      might_access? user
    end

    # @param [User] user
    # @param [Hash] _options
    def manageable_by?(user, _options = {})
      might_access? user
    end

    # @param [User] user
    # @param [Hash] _options
    def readable_by?(_user, _options = {})
      true
    end

    def updatable_by?(_user, _options = {})
      false
    end

    private

    def might_access?(user)
      editor_permissions?(user) || provided_by?(user)
    end

    def provided_by?(user)
      Entitler.has? user
    end
  end
end
