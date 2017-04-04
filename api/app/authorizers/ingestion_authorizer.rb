class IngestionAuthorizer < ApplicationAuthorizer

  def self.creatable_by?(user)
    user.admin?
  end

  def self.readable_by?(_user)
    true
    # user.admin?
  end

  def self.updatable_by?(user)
    user.admin?
  end

  def readble_by?(_user)
    true
  end

end
