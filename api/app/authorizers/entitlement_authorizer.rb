# @see Entitlement
class EntitlementAuthorizer < ApplicationAuthorizer
  # @param [Symbol] _adjective
  # @param [User] user
  # @param [Hash] _options
  # @return [Boolean]
  def default(_adjective, user, _options = {})
    return true if provided_by?(user)
    return true if editor_permissions?(user)

    resource.on_subject do |m|
      m.project do |(project, _)|
        project.resources_manageable_by?(user)
      end

      m.project_collection { false }
      m.system_entitlement { false }
    end
  end

  def creatable_by?(user, _options = {})
    return true if editor_permissions?(user)

    resource.on_subject do |m|
      m.project do |(project, _)|
        project.resources_creatable_by?(user)
      end

      m.project_collection { false }
      m.system_entitlement { false }
    end
  end

  def readable_by?(user, options = {})
    provides_to?(user) || default(:readable, user, options)
  end

  private

  def provided_by?(user)
    resource.entitling_user == user
  end

  def provides_to?(user)
    user.in?(resource.users)
  end

  class << self
    # @param [Symbol] _adjective
    # @param [User] user
    # @param [Hash] _options
    # @return [Boolean]
    def default(_adjective, user, _options = {})
      might_access? user
    end

    def creatable_by?(user, _options = {})
      might_access?(user) || has_any_role?(user, :project_resource_editor)
    end

    def readable_by?(_user, _options = {})
      true
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
