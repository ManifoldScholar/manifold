# frozen_string_literal: true

# An authorizer that builds on {ProjectChildAuthorizer} in order to provide
# users the ability to perform CRUD actions on certain models in a {Project}
# by granting a specific {RoleName::ProjectPropertyManager} role.
#
# @abstract
# @see ProjectProperty
class ProjectPropertyAuthorizer < ProjectChildAuthorizer
  # @note This will also check {#specifically_creatable_by?} which can be
  #   overridden in subclasses for more granular permissions in the future.
  # @see ProjectAuthorizer#properties_creatable_by?
  # @see ProjectAuthorizer#specifically_creatable_by?
  def creatable_by?(user, options = {})
    with_project do |p|
      p.properties_creatable_by?(user, options)
    end || specifically_creatable_by?(user, options)
  end

  # @note This will also check {#specifically_manageable_by?} which can be
  #   overridden in subclasses for more granular permissions in the future.
  # @see ProjectAuthorizer#properties_manageable_by?
  # @see ProjectAuthorizer#specifically_manageable_by?
  def manageable_by?(user, options = {})
    with_project do |p|
      p.properties_manageable_by?(user, options)
    end || specifically_manageable_by?(user, options)
  end

  # Check manage access first since it will supersede {ProjectAuthorizer#fully_readable_by?}
  def readable_by?(user, options = {})
    manageable_by?(user, options) || super
  end

  alias fully_readable_by? readable_by?
  alias deletable_by? manageable_by?
  alias updatable_by? manageable_by?

  # @!group Specificity predicates

  # A predicate used in certain {ProjectPropertyAuthorizer} subclasses
  # to allow more specific access control in the future.
  #
  # @abstract
  # @param [User] _user
  # @param [Hash] _options
  def specifically_creatable_by?(_user, _options = {})
    false
  end

  # A predicate used in certain {ProjectPropertyAuthorizer} subclasses
  # to allow more specific access control in the future.
  #
  # @abstract
  # @param [User] _user
  # @param [Hash] _options
  def specifically_manageable_by?(_user, _options = {})
    false
  end

  # @!endgroup
end
