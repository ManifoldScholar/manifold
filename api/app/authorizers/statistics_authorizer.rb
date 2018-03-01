class StatisticsAuthorizer < ApplicationAuthorizer

  def self.default(_able, _user, _options = {})
    false
  end

  def self.readable_by?(user, _options = {})
    marketeer_permissions?(user)
  end

end
