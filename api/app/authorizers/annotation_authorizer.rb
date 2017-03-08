class AnnotationAuthorizer < ApplicationAuthorizer

  def self.readable_by?(_user)
    true
  end

  def self.creatable_by?(_user)
    true
  end

  def self.deletable_by?(_user)
    true
  end

  def creatable_by?(user)
    resource.format == Annotation::TYPE_RESOURCE ? user.admin? : true
  end

  def deletable_by?(user)
    resource.creator == user || user.admin?
  end
end
