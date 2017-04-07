class EventAuthorizer < ApplicationAuthorizer

  def self.deletable_by?(user)
    user.admin?
  end

end
