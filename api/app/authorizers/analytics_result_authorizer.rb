class AnalyticsResultAuthorizer < ApplicationAuthorizer

  class << self
    def default(_able, user, _options = {})
      admin_permissions?(user)
    end

    # Only admins with read permissions on the scope should be able to view its analytics
    #
    # @see .admin_permissions?
    # @param [User] user
    # @param [Hash] _options
    def readable_by?(user, _options = {})
      return false unless user.present?

      subject_readable = options[:subject]&.readable_by?(user, options)
      admin_permissions?(user) && (subject_readable.nil? ? true : subject_readable)
    end

  end

end
