class NotificationKind < ClassyEnum::Base
  include ActiveSupport::Configurable

  config.visible_to_admin = false
  config.visible_to_editor = false

  # @param [NotificationFrequency, String, Symbol] frequency
  def allow_frequency?(frequency)
    NotificationFrequency.fetch(frequency).then do |freq|
      digest? ? freq.digest? : freq.nondigest?
    end
  end

  def visible_to?(role)
    role = RoleName[role]

    if visible_to_admin?
      role.visible_to_admin?
    elsif visible_to_editor?
      role.visible_to_admin? || role.visible_to_editor?
    else
      true
    end
  end

  def visible_to_admin?
    config.visible_to_admin.present?
  end

  def visible_to_editor?
    config.visible_to_editor.present?
  end

  class << self
    # @param [String] role
    # @return [<NotificationKind>]
    def visible_to(role)
      select { |enum| enum.visible_to? role }
    end

    # @api private
    # @return [void]
    def visible_to_admin!
      config.visible_to_admin = true
    end

    # @api private
    # @return [void]
    def visible_to_editor!
      config.visible_to_editor = true
    end
  end
end

# Notification of a flagged comment
class NotificationKind::FlaggedResources < NotificationKind
  visible_to_admin!
end

# Notification of each annotation or comment made on a user's permissioned texts
class NotificationKind::ProjectCommentsAndAnnotations < NotificationKind
  visible_to_editor!
end

# Notification of direct replies to annotations and comments
class NotificationKind::RepliesToMe < NotificationKind; end

# Daily or weekly collection of installation events.  Content is determined by
# other NotificationKind preferences
class NotificationKind::Digest < NotificationKind; end

# Digest content of changes to all readable projects' children
class NotificationKind::Projects < NotificationKind
  visible_to_editor!
end

# Digest content of changes to all followed projects' children
class NotificationKind::FollowedProjects < NotificationKind; end

# Digest content of all new annotations and comments on readable projects
class NotificationKind::DigestCommentsAndAnnotations < NotificationKind
end
