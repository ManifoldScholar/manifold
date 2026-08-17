# frozen_string_literal: true

class LtiRegistrationAuthorizer < ApplicationAuthorizer
  def self.default(_able, user, _options = {})
    admin_permissions?(user)
  end

  def self.readable_by?(user, _options = {})
    admin_permissions?(user)
  end
end
