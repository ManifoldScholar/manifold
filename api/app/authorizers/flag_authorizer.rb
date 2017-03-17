class FlagAuthorizer < ApplicationAuthorizer

  def self.readable_by?(_user)
    false
  end

  def self.creatable_by?(_user)
    true
  end

  def self.deletable_by?(_user)
    true
  end

  def self.updatable_by?(_user)
    false
  end

  def readable_by?(_user)
    false
  end

  def creatable_by?(_user)
    true
  end

  def deletable_by?(user)
    resource.creator == user || user.admin?
  end

  def updatable_by?(_user)
    false
  end

end
