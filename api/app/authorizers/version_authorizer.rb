class VersionAuthorizer < ApplicationAuthorizer

  def self.readable_by?(user, options = {})
    return true if editor_permissions?(user)
    return false unless options[:for]
    return false unless options[:for].respond_to? :log_readable_by?

    options[:for].log_readable_by? user
  end

end
