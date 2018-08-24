module Notifications
  class NotifyCommentProjectEditors < ActiveInteraction::Base
    object :comment

    delegate :creator, to: :comment
    delegate :parent, to: :comment
    delegate :subject, to: :comment

    def execute
      send_notifications if recipients.present?
    end

    private

    def recipients
      @recipients ||= set_recipients
    end

    def excluded
      out = [creator]
      out << parent.creator if parent.present?
      out
    end

    # rubocop:disable Metrics/LineLength
    def set_recipients
      global_editors = User.with_any_role Role::ROLE_ADMIN, Role::ROLE_EDITOR
      project_editors = subject.project.permitted_users_for_role(Role::EDITOR_ROLES)
      editors = global_editors + project_editors

      editors.select do |editor|
        return false if editor.in? excluded
        editor.wants_notifications_for? NotificationKind[:project_comments_and_annotations]
      end
    end
    # rubocop:enable Metrics/LineLength

    def send_notifications
      Notifications::NotifyThreadProjectEditorsJob.perform_later recipients, comment
    end
  end
end
