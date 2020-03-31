# @see Entitlement
class EntitlementTargetAuthorizer < ApplicationAuthorizer
  # @param [Symbol] _adjective
  # @param [User] _user
  # @param [Hash] _options
  # @return [Boolean]
  def default(_adjective, _user, _options = {})
    true
  end

  class << self
    # @param [Symbol] _adjective
    # @param [User] _user
    # @param [Hash] _options
    # @return [Boolean]
    def default(_adjective, _user, _options = {})
      true
    end
  end
end
