# @see Entitlement
class EntitlementAuthorizer < ApplicationAuthorizer
  # By default, we defer to {ProjectAuthorizer#updatable_by?}.
  def default(_adjective, user, options = {})
    return editor_permissions?(user) unless for_project?

    with_project { |p| p.updatable_by? user, options }
  end

  def readable_by?(user, options = {})
    default(:read, user, options) ||
      provided_by?(user) || provides_to?(user)
  end

  def updatable_by?(_user, _options = {})
    false
  end

  private

  def for_project?
    resource.subject_type == "Project"
  end

  def provided_by?(user)
    resource.entitling_user == user
  end

  def provides_to?(user)
    user.in?(resource.users)
  end

  # @yield [project] do something with a project if it is present on the resource.
  # @yieldparam [Project] project
  # @yieldreturn [Boolean]
  # @return [Boolean]
  def with_project
    project = resource.subject

    return false if project.blank?

    project.then(&Proc.new)
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
    def readable_by?(user, options = {})
      return true unless options
      return admin_permissions?(user) if options[:unscoped]
      return options[:for].updatable_by? user if options[:for]

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
