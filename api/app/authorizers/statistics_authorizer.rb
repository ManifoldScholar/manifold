class StatisticsAuthorizer < ApplicationAuthorizer

  def self.readable_by?(user)
    user.admin?
  end

end
