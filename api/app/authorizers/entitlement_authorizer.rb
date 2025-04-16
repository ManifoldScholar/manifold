# frozen_string_literal: true

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
  def with_project(&)
    project = resource.subject

    return false if project.blank?

    project.then(&)
  end

  class << self
    # @param [Symbol] _adjective
    # @param [User] user
    # @param [Hash] options
    # @option options [ApplicationRecord] :for
    # @return [Boolean]
    def default(_adjective, user, options = {})
      might_access? user, options
    end

    # @param [User] user
    # @param [Hash] options
    # @option options [ApplicationRecord] :for
    def creatable_by?(user, options = {})
      return false if user.marketeer?
      might_access? user, options
    end

    # @param [User] user
    # @param [Hash] options
    # @option options [ApplicationRecord] :for
    def manageable_by?(user, options = {})
      return false if user.marketeer?
      might_access? user, options
    end

    # @param [User] user
    # @param [Hash] options
    # @option options [ApplicationRecord] :for
    def readable_by?(user, options = {})
      if options.present?
        if options[:unscoped]
          return admin_permissions?(user)
        elsif options[:for]
          return might_access_scoped?(user, options)
        end
      end

      true
    end

    def updatable_by?(_user, _options = {})
      false
    end

    private

    # @param [User] user
    # @param [Hash] options
    # @option options [ApplicationRecord] :for
    def might_access?(user, options)
      editor_permissions?(user) || provided_by?(user) || might_access_scoped?(user, options)
    end

    # @param [User] user
    # @param [Hash] options
    # @option options [ApplicationRecord] :for
    def might_access_scoped?(user, options)
      return false unless options && options[:for].respond_to?(:updatable_by?)

      options[:for].updatable_by?(user)
    end

    def provided_by?(user)
      Entitler.has? user
    end
  end
end
