# @see Entitlement
class EntitlementAuthorizer < ApplicationAuthorizer
  # @param [Symbol] _adjective
  # @param [User] user
  # @param [Hash] _options
  # @return [Boolean]
  def default(_adjective, user, _options = {})
    provided_by? user
  end

  def readable_by?(_user, _options = {})
    true
  end

  def deletable_by?(user, _options = {})
    provided_by?(user) || admin_permissions?(user)
  end

  private

  def provided_by?(user)
    resource.entitling_user == user
  end

  class << self
    # @param [Symbol] _adjective
    # @param [User] user
    # @param [Hash] _options
    # @return [Boolean]
    def default(_adjective, user, _options = {})
      admin_permissions? user
    end

    def readable_by?(_user, _options = {})
      true
    end
  end
end
