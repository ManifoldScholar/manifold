class AnalyticReportAuthorizer < ApplicationAuthorizer

  class << self
    def default(_able, user, _options = {})
      admin_permissions?(user)
    end

    # Only admins with read permissions on the scope should be able to view its analytics
    #
    # @see .admin_permissions?
    # @param [User] user
    # @param [Hash] _options
    def readable_by?(user, options = {})
      return false unless user.present?

      scope_readable = options[:report_scope]&.updatable_by?(user, options)
      admin_permissions?(user) && (scope_readable.nil? ? true : scope_readable)
    end

  end

end
