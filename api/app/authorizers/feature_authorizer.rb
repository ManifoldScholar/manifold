# frozen_string_literal: true

class FeatureAuthorizer < ApplicationAuthorizer
  def self.default(_able, user, _options = {})
    marketeer_permissions?(user)
  end

  def self.readable_by?(_user, _options = {})
    true
  end
end
