class SubjectAuthorizer < ApplicationAuthorizer

  def self.default(_able, user, _options = {})
    admin_permissions?(user)
  end

  def self.readable_by?(_user, _options = {})
    true
  end

end
