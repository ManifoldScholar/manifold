module Notifications
  class FetchUsersForCommentNotification < ActiveInteraction::Base
    record :comment

    delegate :creator, to: :comment
    delegate :parent, to: :comment
    delegate :subject, to: :comment

    # TODO: I suspect the queries happening here are not at all optimized -ZD
    def execute
      global_editors = User.with_any_role Role::ROLE_ADMIN, Role::ROLE_EDITOR
      project_editors = subject.project.permitted_users_for_role(Role::EDITOR_ROLES)
      editors = global_editors + project_editors

      editors.select do |editor|
        next false if editor.in? excluded
        editor.wants_notifications_for?(
          NotificationKind[:project_comments_and_annotations]
        )
      end
    end

    private

    def excluded
      out = [creator]
      out << parent.creator if parent.present?
      out
    end

  end
end
